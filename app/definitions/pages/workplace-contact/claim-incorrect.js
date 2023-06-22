const fieldValidators = require('../../field-validators/claim-incorrect');
const {
  claimTypes,
} = require('../../../config/claim-types');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/claim-incorrect.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.employeeName = `${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.forename} ${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.surname}`;

      const {
        claimType,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');

      res.locals.typeOfClaim = claimTypes[claimType];

      next();
    },
  },
});
