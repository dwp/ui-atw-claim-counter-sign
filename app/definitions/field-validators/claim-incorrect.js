const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  claimIncorrect: sf([
    r.required.make({
      errorMsg: {
        summary: 'claim-incorrect:validation.required',
        inline: 'claim-incorrect:validation.required',
      },
    }),
    r.strlen.make({
      max: 300,
      errorMsgMax: {
        inline: 'claim-incorrect:validation.tooLong',
        summary: 'claim-incorrect:validation.tooLong',
      },
    }),
  ]),
};

module.exports = fieldValidators;
