const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const { UPRN } = require('../../../config/regex-definitions');

const fieldValidators = {
  uprn: sf([
    r.required.make({
      errorMsg: {
        summary: 'search-for-address-of-company:select.errors.required',
        inline: 'search-for-address-of-company:select.errors.required',
      },
    }),
    r.regex.make({
      pattern: UPRN,
      errorMsg: {
        summary: 'search-for-address-of-company:select.errors.required',
        inline: 'search-for-address-of-company:select.errors.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
