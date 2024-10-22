const { configure } = require('@dwp/govuk-casa');
const express = require('express');
const expressSession = require('express-session');
const KmsKeyProvider = require('@dwp/dwp-cryptoservice/KmsKeyProvider');
const CryptoService = require('@dwp/dwp-cryptoservice');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./app/config/config-mapping');
const logger = require('./app/logger/logger');
const formatMonthYearObject = require('./app/lib/custom-filters/month-year-formatter');
const formatMonth = require('./app/lib/custom-filters/month-formatter');
const formatLocalDateTime = require('./app/lib/custom-filters/localdatetime-formatter');
const cookieMiddleware = require('./app/middleware/cookie-message');
const urlMiddleware = require('./app/middleware/url.middleware');
const nonceMiddleware = require('./app/middleware/nonce');
const cookieDetailsGet = require('./app/routes/cookies/cookie-details.get');
const cookiePolicyPost = require('./app/routes/cookies/cookie-policy.post');
const cookiePolicyGet = require('./app/routes/cookies/cookie-policy.get');
const cookieParser = require('cookie-parser');
const { registerStaticAssets } = require('./app/lib/static-assets');
const hideSignOutMiddleware = require('./app/middleware/hide-sign-out.middleware');
const languageToggleMiddleware = require('./app/middleware/language-toggle.middleware');

const log = logger('app');

const {
  CONSENT_COOKIE_NAME,
} = require('./app/config/constants');

/**
 * Setup session storage.
 */
const RedisKmsStoreDecorator = require('./app/lib/redis-kms-store-decorator');
const {
  mountURL,
  SESSION_SECURE_COOKIE,
} = require('./app/config/config-mapping');
const {
  WORKPLACE_CONTACT_URL,
  WORKPLACE_CONTACT_CONTEXT_PATH,
  AUTH_CONTEXT_PATH,
} = require('./app/config/uri');

let sessionStore;

if (config.REDIS_PORT && config.REDIS_HOST) {
  log.info('Using redis session storage at %s:%s', config.REDIS_HOST, config.REDIS_PORT);
  log.info(
    'REDIS_CLUSTER = %s, REDIS_DB = %s, TLS = %s',
    config.REDIS_CLUSTER,
    config.REDIS_DB,
    config.REDIS_USE_TLS,
  );

  const RedisStore = require('connect-redis').default;
  const Redis = require('ioredis');
  let redisClient;

  let clusterOptions;

  // Check whether redis is using transit encryption and amend clusterOptions if so
  if (config.REDIS_USE_TLS) {
    log.info('Redis transit encryption enabled');
    clusterOptions = {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: {
        db: config.REDIS_DB,
        tls: {},
      },
    };
  } else {
    log.info('Redis transit encryption disabled');

    clusterOptions = {
      redisOptions: { db: config.REDIS_DB },
    };
  }

  if (config.REDIS_CLUSTER) {
    log.info('Cluster mode enabled');
    redisClient = new Redis.Cluster(
      [
        {
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
        },
      ],
      clusterOptions,
    );
  } else {
    log.info('Cluster mode disabled');
    redisClient = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      db: config.REDIS_DB,
    });
  }

  let retryCount = 0;
  const REDIS_MAX_RETRY = 20;
  redisClient.on('error', (e) => {
    log.error('Redis error: %s', e);
    log.error('Redis error; will retry connection', {
      retry_counter: retryCount,
      err_message: e.message,
      err_stack: e.stack,
    });
    retryCount++;
    if (retryCount > REDIS_MAX_RETRY) {
      log.error('Redis max retry count reached - could not recover from error; exiting');
      log.error(e.message);
      log.debug(e);
      process.exit(1);
    }
  });
  redisClient.on('ready', () => {
    log.info('Redis connection ready');
  });
  redisClient.on('reconnecting', () => {
    log.info('Redis reconnecting');
  });
  redisClient.on('end', () => {
    log.info('Redis connection ended');
  });
  redisClient.on('connect', () => {
    log.info('Redis connection established');
  });
  redisClient.on('warning', (e) => {
    log.warn('Redis warning: %s', e);
  });
  redisClient.on('close', () => {
    log.info('Redis connection closed');
  });

  if (config.REDIS_USE_ENCRYPTION) {
    log.info('Redis session storage using encryption');
    log.info(
      'REDIS_KMS_ID = %s, REDIS_AWS_REGION = %s',
      config.REDIS_KMS_ID,
      config.REDIS_AWS_REGION,
    );
    // Prepare the KMS crypto for encrypting session data
    const kmsKeyProvider = new KmsKeyProvider({
      cmkId: config.REDIS_KMS_ID,
      keySpec: 'AES_256',
      region: config.REDIS_AWS_REGION,
      endpointUrl: config.KMS_ENDPOINT_URL,
    });
    const cryptoService = new CryptoService(kmsKeyProvider);

    // Decorate the session store with KMS-enabled getters/setters
    RedisKmsStoreDecorator(RedisStore, cryptoService);
  }

  // Create session store
  log.info('REDIS_PREFIX = %s', config.REDIS_PREFIX);
  sessionStore = new RedisStore({
    client: redisClient,
    prefix: config.REDIS_PREFIX,
    ttl: config.SESSION_LENGTH,
  });
} else {
  log.info('Using file-based session storage');
  const FileStore = require('session-file-store')(expressSession);
  sessionStore = new FileStore({
    path: './sessions',
    encrypt: true,
    reapInterval: 300,
    secret: config.SESSION_SECRET,
    retries: 0,
  });
}

// Create a new CASA application instance.
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

registerStaticAssets(app);

const casaApp = configure(app, {
  mountUrl: mountURL,
  views: {
    dirs: [
      path.resolve(__dirname, './app/views'),
      path.resolve(__dirname, 'node_modules/hmrc-frontend'),
      path.resolve(__dirname, 'node_modules/nhsuk-frontend/packages/components'),
    ],
  },
  compiledAssetsDir: path.resolve(__dirname, './static/'),
  serviceName: 'common:serviceName',
  phase: 'alpha',
  sessions: {
    name: config.SESSION_NAME,
    store: sessionStore,
    secret: config.SESSION_SECRET,
    ttl: config.SESSION_LENGTH,
    secure: config.SESSION_SECURE_COOKIE,
  },
  i18n: {
    dirs: [path.resolve(__dirname, './app/locales')],
    locales: config.SHOW_WELSH_LANGUAGE_TOGGLE ? ['en', 'cy'] : ['en'],
  },
  allowPageEdit: true,
  useStickyEdit: false,
});

if (config.SESSION_SECURE_COOKIE) {
  log.info('Enabling secure cookies (trust proxy)');
  app.set('trust proxy', 1);
}

app.get('nunjucksEnv')
  .addFilter('formatMonthYearObject', formatMonthYearObject)
  .addFilter('formatMonth', formatMonth)
  .addFilter('formatLocalDateTime', formatLocalDateTime);

nonceMiddleware(casaApp.router, true);
cookieMiddleware(
  casaApp.router,
  CONSENT_COOKIE_NAME,
  'cookie-policy',
  'cookie-consent',
  '.get-disability-work-support.service.gov.uk', // CONFIG.GOOGLE_TAG_MANAGER_DOMAIN,
  mountURL, // mountUrl,
  '/', // proxyMountUrl,
  SESSION_SECURE_COOKIE, // useTLS,
);
urlMiddleware(casaApp.router);

hideSignOutMiddleware(casaApp.router);

if (config.SHOW_WELSH_LANGUAGE_TOGGLE) {
  languageToggleMiddleware(casaApp.router);
}

// Custom, non-journey routes handlers.
// Add any routes that are not involved in the data-gathering journey
// (e.g. feedback page, welcome/'before you start' page, other info pages, etc)
// should be declared before you load the CASA page/journey definitions.
require('./app/routes/index')(casaApp);
require('./app/routes/ping')(casaApp.router);
require('./app/routes/claim-submitted')(casaApp);

// Feedback
require('./app/routes/feedback/help-us-improve-this-service')(casaApp);

// Error
require('./app/routes/error/problem-with-service')(casaApp);

const pageDefinitions = require('./app/definitions/pages')();
const journeyDefinition = require('./app/definitions/journeys')();

casaApp.router.use(WORKPLACE_CONTACT_CONTEXT_PATH, (req, res, next) => {
  if (req.session.AUTH_STATE === 'AUTHENTICATED') {
    log.debug('User is authenticated as expected so proceed');
    next();
  } else {
    log.warn('User is not authenticated - redirecting to Enter claim reference page');
    res.redirect(mountURL);
  }
});

casaApp.router.use(AUTH_CONTEXT_PATH, (req, res, next) => {
  if (req.session.AUTH_STATE === 'AUTHENTICATED') {
    log.warn('User authenticated push them forward to about-claim page');
    res.redirect(`${WORKPLACE_CONTACT_URL}/about-claim`);
  } else {
    log.debug('User is not authenticated as expected so proceed');
    next();
  }
});

// Cookie policy pages
casaApp.router.get('/cookie-details', cookieDetailsGet(
  CONSENT_COOKIE_NAME,
  config.SESSION_NAME,
  config.SESSION_LENGTH,
));
casaApp.router.get('/cookie-policy', cookiePolicyGet());

casaApp.router.post('/cookie-policy', cookiePolicyPost(
  CONSENT_COOKIE_NAME,
  mountURL, // casaApp.config.mountUrl,
  '.dwp.gov.uk', // CONFIG.GOOGLE_TAG_MANAGER_DOMAIN,
  SESSION_SECURE_COOKIE, // CONFIG.USE_TLS,
));

// Load CASA page and user journey definitions
casaApp.loadDefinitions(
  pageDefinitions,
  journeyDefinition,
);

// Start server
const server = app.listen(config.PORT, () => {
  const host = server.address().address;
  const { port } = server.address();
  log.info('App listening at http://%s:%s', host, port);
});
