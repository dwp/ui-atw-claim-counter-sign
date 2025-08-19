const axios = require('axios');
const generateSHA512HashValue = require('../../../utils/generate-sha512-hash-value');
const fieldValidators = require('../../field-validators/enter-claim-reference-number');
const removeAllSpaces = require('../../../utils/remove-all-spaces');
const logger = require('../../../logger/logger');
const config = require('../../../config/config-mapping');

const log = logger('definitions:pages.workplace-contact.enter-claim-reference-number');

const {
  url: claimUrl,
} = config.claimService;

const {
  url: securityUrl,
} = config.securityNumberService;

async function checkClaimRef(claimRef) {
  return axios({
    method: 'post',
    url: '/claim-to-workplace-contact',
    baseURL: claimUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      claimReference: claimRef.toUpperCase(),
    },
  });
}

async function getSecurityNumber(emailAddress, claimRef) {
  return axios({
    method: 'post',
    url: '/v1/totp/generate',
    baseURL: securityUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      comm: 'EMAIL',
      contact: emailAddress,
      secret: claimRef,
    },
  });
}

module.exports = () => ({
  view: 'pages/workplace-contact/enter-claim-reference-number.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      req.session.AUTH_STATE = undefined;
      req.session.wrongNumberErrorCount = undefined;
      res.locals.previouslyEnteredClaimReference = req.session.previouslyEnteredClaimReference;
      next();
    },
    pregather: (req, res, next) => {
      req.session.previouslyEnteredClaimReference = req.body.claimReference;
      req.body.claimReference = removeAllSpaces(req.body.claimReference).toUpperCase();
      next();
    },
    postvalidate: async (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('enter-claim-reference-number');

      try {
        const result = await checkClaimRef(pageData.claimReference);

        if (result.status === 200) {
          log.debug('result status 200');
          req.casa.journeyContext.setDataForPage('__hidden_user_claim__', result.data);
          const hiddenData = result.data;
          const hashValue = generateSHA512HashValue(pageData.claimReference);

          // Send TOTP Email
          await getSecurityNumber(
            hiddenData.workplaceContact.emailAddress,
            hashValue,
          );
          req.session.lastEmailSentTime = Date.now();
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            log.debug('result status 200 next()');
            next();
          });
        } else {
          log.debug(`result status !== 200 is was ${result.status}`);

          const errorMessage = res.locals.t('enter-claim-reference-number:validation.notFound.p2');
          const error = {
            claimReference: [
              {
                field: 'claimReference',
                fieldHref: '#f-claimReference',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage,
                summary: errorMessage,
              }],
          };
          log.debug(`result status !== 200 is was ${result.status} next()`);
          next(error);
        }
      } catch (e) {
        log.debug('enter-claim-reference-number catch block');
        const resp = e.response;
        log.error(e);
        let errorMessage;
        log.debug(`resp?.status is ${resp?.status}`);
        if (resp?.status === 400) {
          // Claim cannot be countersigned EA
          errorMessage = res.locals.t('enter-claim-reference-number:validation.notFound.p1');
        } else if (resp?.status === 404) {
          // Claim not found
          errorMessage = res.locals.t('enter-claim-reference-number:validation.notFound.p1');
        } else if (resp?.status === 423) {
          // Claim not awaiting countersignature
          errorMessage = res.locals.t('enter-claim-reference-number:validation.notFound.p1');
        } else {
          errorMessage = res.locals.t('enter-claim-reference-number:validation.notFound.p2');
        }
        const error = {
          claimReference: [
            {
              field: 'claimReference',
              fieldHref: '#f-claimReference',
              focusSuffix: '',
              validator: 'required',
              inline: errorMessage,
              summary: errorMessage,
            }],
        };
        log.debug('enter-claim-reference-number catch block next()');
        next(error);
      }
    },
  },
});
