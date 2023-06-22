const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  reviewClaim: sf([
    r.required.make({
      errorMsg: {
        summary: 'about-claim:validation.required',
        inline: 'about-claim:validation.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
