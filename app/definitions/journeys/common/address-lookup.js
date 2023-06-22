/* eslint-disable no-underscore-dangle */
const { wasSkipped } = require('../../../helpers/journey-helpers');

const addressLookup = (plan) => {
  plan.setRoute('company-organisation-name', 'postcode-of-company');
  plan.setRoute('postcode-of-company', 'search-for-address-of-company');

  plan.setRoute(
    'search-for-address-of-company',
    'enter-address-of-company',
    wasSkipped('search-for-address-of-company'),
  );

  plan.setRoute(
    'search-for-address-of-company',
    'job-title',
    (r, c) => !wasSkipped('search-for-address-of-company')(r, c),
  );
  plan.setRoute('enter-address-of-company', 'job-title');
};

module.exports = (plan) => addressLookup(plan);
