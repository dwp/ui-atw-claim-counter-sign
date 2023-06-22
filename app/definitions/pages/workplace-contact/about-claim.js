const fieldValidators = require('../../field-validators/about-claim');
const {
  claimTypesToDisplayText,
  claimTypes,
} = require('../../../config/claim-types');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/about-claim.njk',
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
        createdDate,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
        .padStart(8, '0')}`;
      res.locals.createdDate = createdDate;
      res.locals.typeOfClaim = claimTypesToDisplayText[claimType];

      res.locals.casa.journeyPreviousUrl = res.locals.casa.mountUrl;

      next();
    },
  },
});
