const fieldValidators = require('../../field-validators/common/optional-validator');
const {
  claimTypesToDisplayText,
  claimTypes,
  claimTypesSetKey
} = require('../../../config/claim-types');
const { AUTH_URL } = require('../../../config/uri');

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
      if (claimType === claimTypesSetKey.TIW) {
        res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
          .padStart(7, '0')}`;
      } else {
        res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
          .padStart(8, '0')}`;
      }
      res.locals.createdDate = createdDate;
      res.locals.typeOfClaim = claimTypesToDisplayText[claimType];
      res.locals.casa.journeyPreviousUrl = res.locals.casa.mountUrl;
      res.locals.enterClaimReferenceNumberUrl = `${AUTH_URL}/enter-claim-reference-number`;
      next();
    },
  },
});