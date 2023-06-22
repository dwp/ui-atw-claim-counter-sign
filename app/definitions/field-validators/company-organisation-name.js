const {
  validationRules: r,
  simpleFieldValidation: sf,
} = require('@dwp/govuk-casa');

const fieldValidators = {
  companyOrganisationName: sf([
    r.required.make({
      errorMsg: {
        summary: 'company-organisation-name:validation.required',
        inline: 'company-organisation-name:validation.required',
      },
    }),
  ]),
};

module.exports = fieldValidators;
