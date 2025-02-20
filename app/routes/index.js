const { AUTH_URL } = require('../config/uri');

module.exports = (casaApp) => {
  casaApp.router.get('/', (req, res) => {
    const requestOrigin = req.originalUrl;
    if (requestOrigin.includes('/review-claim')) {
      return requestOrigin.endsWith('/')
      ? casaApp.endSession(req)
      .then(() => {
        res.redirect(`${AUTH_URL}/enter-claim-reference-number`);
      })
    : res.redirect(`${requestOrigin}/`);
    };
  });
};
