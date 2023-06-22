const fieldValidators = require('../../field-validators/job-title');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/job-title.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      if (req.inEditMode) {
        req.casa.journeyContext.setValidationErrorsForPage('check-your-answers', undefined);
      }
      next();
    },
  },
});
