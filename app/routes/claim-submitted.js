const {
  mountURL,
} = require('../config/config-mapping');
const { claimTypes } = require('../config/claim-types');
const {
  WORKPLACE_CONTACT_CONTEXT_PATH,
} = require('../config/uri');

module.exports = (casaApp) => {
  const submittedClaim = (req, res, successfulSubmit) => {
    // redo the gate keeping once Plan is done
    const correctClaim = req.casa.journeyContext?.getDataForPage('claim-summary')?.correctClaim;
    let nextPageViewFile;
    res.locals.BUTTON_TEXT = res.locals.t('common:returnToAccountHome');
    let valid = false;

    if (successfulSubmit && correctClaim === 'yes') {
      const filledIn = req.casa.journeyContext.getDataForPage('claim-summary');
      const filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
        'claim-summary',
      );
      nextPageViewFile = 'pages/workplace-contact/claim-confirmed.njk';
      valid = Object.keys(filledInAndValid).length === 0
        && (filledIn && Object.keys(filledIn).length > 0);
    } else if (!successfulSubmit && correctClaim === 'no') {
      const filledIn = req.casa.journeyContext.getDataForPage('claim-incorrect');
      const filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
        'claim-incorrect',
      );
      nextPageViewFile = 'pages/workplace-contact/claim-returned.njk';
      valid = Object.keys(filledInAndValid).length === 0
        && (filledIn && Object.keys(filledIn).length > 0);
    }

    if (valid) {
      res.locals.employeeName = `${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.forename} ${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.surname}`;
      const {
        id: claimNumber,
        claimType,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
        .padStart(8, '0')}`;
      // End the session
      casaApp.endSession(req)
        .then(() => {
          res.locals.noNextButton = true;
          res.render(nextPageViewFile);
        });
    } else {
      res.redirect(mountURL);
    }
  };

  casaApp.router.get(
    `${WORKPLACE_CONTACT_CONTEXT_PATH}/claim-confirmed`,
    (req, res) => submittedClaim(req, res, true),
  );
  casaApp.router.get(
    `${WORKPLACE_CONTACT_CONTEXT_PATH}/claim-returned`,
    (req, res) => submittedClaim(req, res, false),
  );

  return submittedClaim;
};
