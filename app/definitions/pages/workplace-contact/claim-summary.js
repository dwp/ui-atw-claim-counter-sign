const fieldValidators = require('../../field-validators/claim-summary');
const {
  claimTypes,
} = require('../../../config/claim-types');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/claim-summary.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.employeeName = `${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.forename} ${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.surname}`;

      const {
        id: claimNumber,
        claimType,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
        .padStart(8, '0')}`;
      res.locals.typeOfClaim = claimTypes[claimType];

      res.locals.claimData = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');

      next();
    },
  },
});
