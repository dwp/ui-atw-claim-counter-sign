const fieldValidators = require('../../field-validators/company-organisation-name');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/company-organisation-name.njk',
  fieldValidators,
  reviewBlockView: 'pages/common/review/organisation-information.njk',
  hooks: {
    prerender: (req, res, next) => {
      if (req.inEditMode) {
        req.casa.journeyContext.setValidationErrorsForPage('check-your-answers', undefined);
      }
      next();
    },
  },
});
