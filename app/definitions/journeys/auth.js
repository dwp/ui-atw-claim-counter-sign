const {
  wasSkipped,
  notSkipped,
} = require('../../helpers/journey-helpers');

const workplaceContact = (plan) => {
  plan.setRoute(
    'enter-claim-reference-number',
    'confirm-claim-reference-number',
    wasSkipped('enter-claim-reference-number'),
  );
  plan.setRoute(
    'enter-claim-reference-number',
    'security-number',
    notSkipped('enter-claim-reference-number'),
  );

  plan.setRoute(
    'security-number',
    'incorrect-code',
  );

  plan.setRoute(
    'incorrect-code',
    'enter-claim-reference-number',
  );

  // See security-number for the redirect to the workplace-contact journey

  plan.addOrigin('auth', 'enter-claim-reference-number');
};

module.exports = workplaceContact;
