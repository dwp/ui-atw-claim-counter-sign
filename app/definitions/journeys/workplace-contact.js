const {
  isYes,
  isNo,
} = require('../../helpers/journey-helpers');

const addressLookup = require('./common/address-lookup');

const workplaceContact = (plan) => {
  plan.setRoute('about-claim', 'what-you-will-need', isYes('reviewClaim', 'about-claim'));
  plan.setRoute('about-claim', 'incorrect-claim', isNo('reviewClaim', 'about-claim'));

  plan.setRoute('incorrect-claim', 'enter-claim-reference-number');

  plan.setRoute('what-you-will-need', 'company-organisation-name');

  addressLookup(plan);

  plan.setRoute('job-title', 'check-your-answers');
  plan.setRoute('check-your-answers', 'claim-summary');

  plan.setRoute('claim-summary', 'declaration', isYes('correctClaim', 'claim-summary'));
  plan.setRoute('claim-summary', 'claim-incorrect', isNo('correctClaim', 'claim-summary'));

  plan.setRoute('claim-incorrect', 'request-changes-to-claim');
  plan.setRoute('request-changes-to-claim', 'claim-returned');

  plan.addOrigin('workplace-contact', 'about-claim');
};

module.exports = workplaceContact;
