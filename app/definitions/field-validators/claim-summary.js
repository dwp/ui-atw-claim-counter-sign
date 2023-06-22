const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  correctClaim: sf([
    r.required.make({
      errorMsg: {
        summary: 'claim-summary:validation.required',
        inline: 'claim-summary:validation.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
