const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const regexDefinitions = require('../../config/regex-definitions');

const fieldValidators = {
  securityNumber: sf([
    r.required.make({
      errorMsg: {
        summary: 'security-number:validation.required',
        inline: 'security-number:validation.required',
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.NUMBER_REGEX,
      errorMsg: {
        inline: 'security-number:validation.invalid',
        summary: 'security-number:validation.invalid',
      },
    }),
    r.strlen.make({
      max: 6,
      errorMsgMax: {
        inline: 'security-number:validation.tooLong',
        summary: 'security-number:validation.tooLong',
      },
    }),
  ]),
};

module.exports = fieldValidators;
