const { wasSkipped } = require('../../../helpers/journey-helpers');

const addressLookup = (plan) => {
  plan.setRoute('company-organisation-name', 'company-postcode');
  plan.setRoute('company-postcode', 'company-address-search');

  plan.setRoute(
    'company-address-search',
    'enter-company-address',
    wasSkipped('company-address-search'),
  );

  plan.setRoute(
    'company-address-search',
    'job-title',
    (r, c) => !wasSkipped('company-address-search')(r, c),
  );
  plan.setRoute('enter-company-address', 'job-title');
};

module.exports = (plan) => addressLookup(plan);
