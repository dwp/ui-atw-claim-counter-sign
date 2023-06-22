const { mountURL } = require('../config/config-mapping');
const logger = require('../logger/logger');

const log = logger('middleware:journey-type');

module.exports = (
  app,
) => {
  // eslint-disable-next-line consistent-return
  app.use(async (req, res, next) => {
    log.debug('middleware: url.middleware');

    res.locals.feedbackUrl = `${mountURL}feedback?referrer=${res.locals.currentUrl}`;
    next();
  });
};
