const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  jobTitle: sf([
    r.required.make({
      errorMsg: {
        summary: 'job-title:validation.required',
        inline: 'job-title:validation.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
