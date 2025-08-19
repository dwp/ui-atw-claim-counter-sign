const axios = require('axios');
const fieldValidators = require('../../field-validators/common/optional-validator');
const logger = require('../../../logger/logger');
const config = require('../../../config/config-mapping');
const cleanData = require('../../../utils/clean-data');
const constants = require('../../../config/constants');

const log = logger('definitions:pages.workplace-contact.declaration');

const {
  claimTypes,
} = require('../../../config/claim-types');
const { WORKPLACE_CONTACT_URL } = require('../../../config/uri');

const {
  mountURL,
} = config;

const {
  url,
} = config.claimService;

const declarationVersion = constants.DECLARATION_VERSION;

async function acceptClaim(acceptData) {
  return axios({
    method: 'put',
    url: '/accept',
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: acceptData,
  });
}

// set page to display
let pageToDisplay;

if (declarationVersion === 1.0) {
  pageToDisplay = 'pages/workplace-contact/1.0/declaration.njk';
} else {
  throw new Error(`Declaration version ${declarationVersion} not supported`);
}

module.exports = () => ({
  view: pageToDisplay,
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.BUTTON_TEXT = res.locals.t('declaration:link');

      res.locals.employeeName = `${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.forename} ${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.surname}`;

      const {
        claimType,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');

      res.locals.typeOfClaim = claimTypes[claimType];

      next();
    },
    postvalidate: async (req, res) => {
      const {
        id: claimNumber,
        claimType,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      const organisationName = req.casa.journeyContext.getDataForPage(
        'company-organisation-name',
      ).companyOrganisationName;
      const { jobTitle } = req.casa.journeyContext.getDataForPage('job-title');
      const { addressDetails } = req.casa.journeyContext.getDataForPage('__hidden_address__');

      const acceptData = {
        claimNumber,
        claimType,
        organisation: organisationName,
        jobTitle,
        address: addressDetails,
        declarationVersion,
      };

      try {
        const result = await acceptClaim(cleanData(acceptData));

        if (result.status === 204) {
          res.redirect(`${WORKPLACE_CONTACT_URL}/claim-confirmed`);
        } else {
          log.error(`Unexpected return status: ${result.status}`);
          res.redirect(`${mountURL}problem-with-service`);
        }
      } catch (e) {
        log.error(`Failed to send claim: ${e.message}`);
        res.redirect(`${mountURL}problem-with-service`);
      }
    },
  },
});
