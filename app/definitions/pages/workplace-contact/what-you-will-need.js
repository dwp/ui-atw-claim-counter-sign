const fieldValidators = require('../../field-validators/common/optional-validator');
const {
  claimTypes,
} = require('../../../config/claim-types');

module.exports = () => ({
  view: 'pages/workplace-contact/what-you-will-need.njk',
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
