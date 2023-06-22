const { AUTH_CONTEXT_PATH } = require('../config/uri');

module.exports = (app) => {
  const populateResLocals = (req, res, next) => {
    res.locals.hideSignOut = true;
    next();
  };
  app.use(AUTH_CONTEXT_PATH, populateResLocals);

  return { populateResLocals };
};
