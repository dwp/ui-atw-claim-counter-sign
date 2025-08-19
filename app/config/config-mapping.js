const config = require('config');
const pkg = require('../../package.json');

const APP_VERSION = pkg.version;
const PORT = config.get('app.port');

const mountURL = config.get('app.mountUrl');

// Get redis config from environment
const USE_REDIS = config.has('session.redis.host') && config.get('session.redis.host') !== null
  && config.has('session.redis.port') && config.get('session.redis.port') !== null;
const REDIS_HOST = USE_REDIS ? config.get('session.redis.host') : null;
const REDIS_PORT = USE_REDIS ? config.get('session.redis.port') : null;
const REDIS_PASSWORD = USE_REDIS ? config.get('session.redis.password') : null;
const REDIS_DB = USE_REDIS ? config.get('session.redis.database') : null;
const REDIS_CLUSTER = USE_REDIS ? config.get('session.redis.cluster') : null;
const REDIS_USE_ENCRYPTION = USE_REDIS ? config.get('session.redis.useEncryption') : null;
const REDIS_KMS_ID = USE_REDIS ? config.get('session.redis.kmsId') : null;
const REDIS_AWS_REGION = USE_REDIS ? config.get('session.redis.awsRegion') : null;
const REDIS_PREFIX =USE_REDIS ? config.get('session.redis.prefix') : null;
const REDIS_USE_TLS = USE_REDIS ? config.get('session.redis.useTLS') : null;

// AWS cli looks for null here, so force it if it's undefined
const KMS_ENDPOINT_URL = config.has('session.redis.kmsEndpoint')
  ? config.get('session.redis.kmsEndpoint')
  : null;

const SESSION_SECURE_COOKIE = config.get('session.secure.cookie');
const SESSION_LENGTH = config.get('session.length');
const SESSION_NAME = config.get('session.name');

const SESSION_SECRET = config.get('session.secret');
const SHOW_WELSH_LANGUAGE_TOGGLE = config.get('languageToggle.showWelshLanguageToggle');

const addressLookup = {
  url: config.get('services.addressLookup.url'),
  contextPath: config.get('services.addressLookup.contextPath'),
  ca: config.get('services.addressLookup.ca'),
  proxy: config.get('services.addressLookup.proxy'),
};

const claimService = {
  url: config.get('services.claimService.url'),
};

const securityNumberService = {
  url: config.get('services.securityNumberService.url'),
  skipValidation: config.get('services.securityNumberService.skipValidation'),
};

const cookieDomain = config.get('services.cookieHandler.domain');
const cookiePath = config.get('services.cookieHandler.path');

module.exports = {
  mountURL,
  APP_VERSION,
  PORT,
  USE_REDIS,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB,
  REDIS_CLUSTER,
  REDIS_USE_ENCRYPTION,
  REDIS_KMS_ID,
  REDIS_AWS_REGION,
  REDIS_PREFIX,
  REDIS_USE_TLS,
  KMS_ENDPOINT_URL,
  SESSION_SECURE_COOKIE,
  SESSION_LENGTH,
  SESSION_NAME,
  SESSION_SECRET,
  SHOW_WELSH_LANGUAGE_TOGGLE,
  claimService,
  securityNumberService,
  addressLookup,
  cookieDomain,
  cookiePath,
};
