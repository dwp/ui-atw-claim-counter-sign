const axios = require('axios');
const fieldValidators = require('../../field-validators/common/optional-validator');
const {
  claimTypesToDisplayText,
  claimTypes,
  claimTypesSetKey
} = require('../../../config/claim-types');
const logger = require('../../../logger/logger');
const config = require('../../../config/config-mapping');
const cleanData = require('../../../utils/clean-data');

const log = logger('definitions:pages.workplace-contact.request-changes-to-claim');

const {
  mountURL,
} = config;

const {
  url,
} = config.claimService;

async function rejectClaim(rejectData) {
  return axios({
    method: 'put',
    url: '/reject',
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: rejectData,
  });
}

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/request-changes-to-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.employeeName = `${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.forename} ${req.casa.journeyContext.getDataForPage(
        '__hidden_user_claim__',
      ).claimant.surname}`;
      const {
        id: claimNumber,
        claimType,
        createdDate,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      if (claimType === claimTypesSetKey.TIW) {
        res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
          .padStart(7, '0')}`;
      } else {
        res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
          .padStart(8, '0')}`;
      }
      res.locals.typeOfClaim = claimTypesToDisplayText[claimType];
      res.locals.createdDate = createdDate;
      res.locals.claimIncorrect = req.casa.journeyContext.getDataForPage(
        'claim-incorrect',
      ).claimIncorrect;
      res.locals.BUTTON_TEXT = res.locals.t('request-changes-to-claim:link');

      next();
    },
    postvalidate: async (req, res, next) => {
      const {
        id: claimNumber,
        claimType,
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      const organisation = req.casa.journeyContext.getDataForPage(
        'company-organisation-name',
      ).companyOrganisationName;
      const { jobTitle } = req.casa.journeyContext.getDataForPage('job-title');
      const reason = req.casa.journeyContext.getDataForPage('claim-incorrect').claimIncorrect;
      const { addressDetails } = req.casa.journeyContext.getDataForPage('__hidden_address__');

      const rejectData = {
        claimNumber,
        claimType,
        organisation,
        jobTitle,
        reason,
        address: addressDetails,
      };

      try {
        const result = await rejectClaim(cleanData(rejectData));

        if (result.status === 204) {
          next();
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
