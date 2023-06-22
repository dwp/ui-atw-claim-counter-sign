/* eslint-disable global-require */
module.exports = () => {
  const commonPages = {
    'postcode-of-company': require('./common/postcode-of-company')(),
    'search-for-address-of-company': require('./common/search-for-address-of-company')(),
    'enter-address-of-company': require('./common/enter-address-of-company')(),
    'check-your-answers': require('./common/check-your-answers')(),
  };

  const auth = {
    'enter-claim-reference-number': require('./workplace-contact/enter-claim-reference-number')(),
    'confirm-claim-reference-number': require(
      './workplace-contact/confirm-claim-reference-number',
    )(),
    'security-number': require('./workplace-contact/security-number')(),
    'incorrect-code': require('./workplace-contact/incorrect-code')(),
  };

  const workplaceContactJourney = {
    'about-claim': require('./workplace-contact/about-claim')(),
    'incorrect-claim': require('./workplace-contact/incorrect-claim')(),
    'what-you-will-need': require('./workplace-contact/what-you-will-need')(),
    'company-organisation-name': require('./workplace-contact/company-organisation-name')(),
    'job-title': require('./workplace-contact/job-title')(),
    'claim-summary': require('./workplace-contact/claim-summary')(),
    declaration: require('./workplace-contact/declaration')(),
    'claim-incorrect': require('./workplace-contact/claim-incorrect')(),
    'request-changes-to-claim': require('./workplace-contact/request-changes-to-claim')(),
  };

  commonPages['check-your-answers'] = require('./common/check-your-answers')(
    { ...workplaceContactJourney, ...commonPages },
  );

  return {
    ...auth,
    ...commonPages,
    ...workplaceContactJourney,
  };
};
