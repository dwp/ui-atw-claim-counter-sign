const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');
const regexDefinitions = require('../../../config/regex-definitions');

const fieldValidators = {
  postcode: sf([
    r.required.make({
      errorMsg: {
        inline: 'postcode-of-company:inputs.postcode.errors.required',
        summary: 'postcode-of-company:inputs.postcode.errors.required',
        variables: ({ journeyContext }) => ({
          companyOrganisationName: journeyContext.getDataForPage(
            'company-organisation-name',
          ).companyOrganisationName,
        }),
      },
    }),
    r.regex.make({
      pattern: regexDefinitions.POSTCODE,
      errorMsg: {
        inline: 'postcode-of-company:inputs.postcode.errors.invalid',
        summary: 'postcode-of-company:inputs.postcode.errors.invalid',
      },
    }),

  ]),
};
module.exports = fieldValidators;
