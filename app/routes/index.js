const { AUTH_URL } = require('../config/uri');

module.exports = (casaApp) => {
  casaApp.router.get('/', (req, res) => {
    const requestOrigin = req.originalUrl;
    return requestOrigin.endsWith('/')
      ? casaApp.endSession(req)
        .then(() => {
          res.redirect(`${AUTH_URL}/enter-claim-reference-number`);
        })
      : res.redirect(`${requestOrigin}/`);
  });
};
