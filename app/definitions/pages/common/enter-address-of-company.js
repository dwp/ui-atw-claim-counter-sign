const { trimPostalAddressObject } = require('@dwp/govuk-casa').gatherModifiers;
const fieldValidators = require('../../field-validators/common/enter-address-of-company');

const sourceAddressWP = 'enter-company-address';
const hiddenAddressWP = '__hidden_address__';

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/common/enter-address-of-company.njk',
  fieldGatherModifiers: {
    address: trimPostalAddressObject,
  },
  fieldValidators,
  hooks: {
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect('check-your-answers');
        });
      } else {
        next();
      }
    },
    prerender: (req, res, next) => {
      if (req.inEditMode) {
        req.casa.journeyContext.setValidationErrorsForPage('check-your-answers', undefined);
      }
      res.locals.companyName = req.casa.journeyContext.getDataForPage(
        'company-organisation-name',
      ).companyOrganisationName;

      next();
    },
    postvalidate: (req, res, next) => {
      req.casa.journeyContext.setDataForPage(hiddenAddressWP, {
        addressDetails: req.casa.journeyContext.getDataForPage(sourceAddressWP).address,
        addressFrom: 'manual',

      });

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        next();
      });
    },
  },
});
