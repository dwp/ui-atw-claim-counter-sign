const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const regexDefinitions = require('../../config/regex-definitions');

const fieldValidators = {
  claimReference: sf([
    r.required.make({
      errorMsg: {
        summary: 'enter-claim-reference-number:validation.required',
        inline: 'enter-claim-reference-number:validation.required',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.CLAIM_TYPE_CHECK,
      errorMsg: {
        inline: 'enter-claim-reference-number:validation.invalid',
        summary: 'enter-claim-reference-number:validation.invalid',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.CLAIM_TYPE_PREFIX_CHECK,
      errorMsg: {
        inline: 'enter-claim-reference-number:validation.prefix',
        summary: 'enter-claim-reference-number:validation.prefix',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.SPECIAL_CHARACTERS,
      errorMsg: {
        inline: 'enter-claim-reference-number:validation.specialCharacter',
        summary: 'enter-claim-reference-number:validation.specialCharacter',
      },
    }),
    r.strlen.make({
      max: 10,
      errorMsgMax: {
        inline: 'enter-claim-reference-number:validation.tooLong',
        summary: 'enter-claim-reference-number:validation.tooLong',
      },
    }),
  ]),
};

module.exports = fieldValidators;
