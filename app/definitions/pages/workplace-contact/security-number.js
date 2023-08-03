const axios = require('axios');
const generateSHA512HashValue = require('../../../utils/generate-sha512-hash-value');
const fieldValidators = require('../../field-validators/security-number');
const removeAllSpaces = require('../../../utils/remove-all-spaces');
const logger = require('../../../logger/logger');
const config = require('../../../config/config-mapping');
const { WORKPLACE_CONTACT_URL } = require('../../../config/uri');

const log = logger('definitions:pages.workplace-contact.security-number');

const {
  url: claimUrl,
} = config.claimService;

const {
  url: securityUrl,
} = config.securityNumberService;

const {
  url,
  skipValidation,
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

async function postSecurityNumber(claimRef, securityNumber) {
  return axios({
    method: 'post',
    url: '/v1/totp/verify',
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      secret: claimRef,
      totp: securityNumber,
    },
  });
}

const computeErrorSummary = (req, res) => {
  const maxAttempts = 2;
  let errorCounter = req.session.wrongNumberErrorCount;

  if (errorCounter === undefined) {
    errorCounter = 0;
  }

  if (errorCounter >= maxAttempts) {
    errorCounter = maxAttempts;
  }

  const errorSummary = res.locals.t('security-number:validation.summary_attempts.p1') + (maxAttempts - errorCounter)
    + res.locals.t('security-number:validation.summary_attempts.p2');
  req.session.wrongNumberErrorCount = (errorCounter + 1);
  return errorSummary;
};

const computeTimeDiff = (lastTime) => {
  const now = new Date().getTime();

  const howLongAgo = now - lastTime;
  let minutes = 0;
  if (howLongAgo > (1000 * 60)) {
    minutes = parseInt(howLongAgo / (1000 * 60), 10);
  }
  return minutes;
};

const shouldResendEmail = (req) => {
  const lastEmailSentTime = computeTimeDiff(req.session.lastEmailSentTime);
  const ONE_MINUTE = 1;
  return lastEmailSentTime && lastEmailSentTime >= ONE_MINUTE;
};

const sendTotpEmail = async (hiddenData, cpageData) => {
  await getSecurityNumber(
    hiddenData.workplaceContact.emailAddress,
    cpageData,
  );
};

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/security-number.njk',
  fieldValidators,
  hooks: {
    prerender: async (req, res, next) => {
      const counter = req.session.wrongNumberErrorCount;
      if (counter === undefined) {
        req.session.wrongNumberErrorCount = 0;
      } else if (counter >= 3) {
        req.casa.journeyContext.clearValidationErrorsForPage('security-number');
        return req.session.save(() => res.redirect('incorrect-number'));
      }

      if (req.query.m !== undefined && res.locals.errorPage !== true) {
        res.locals.showResend = true;

        try {
          const cpageData = req.casa.journeyContext.getDataForPage('enter-claim-reference-number');
          const result = await checkClaimRef(cpageData.claimReference);

          if (result.status === 200) {
            req.casa.journeyContext.setDataForPage('__hidden_user_claim__', result.data);
            const hiddenData = result.data;
            const hashvalue = generateSHA512HashValue(cpageData.claimReference);

            if (shouldResendEmail(req)) {
              await sendTotpEmail(
                hiddenData,
                hashvalue,
              );

              // last sent email time
              req.session.lastEmailSentTime = Date.now();
              req.session.wrongNumberErrorCount = 0;
            }
          }
        } catch (e) {
          log.error(e);
        }
      }
      return req.session.save(() => next());
    },
    pregather: (req, res, next) => {
      req.body.securityNumber = removeAllSpaces(req.body.securityNumber);
      next();
    },
    postvalidate: async (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('security-number');
      const claimData = req.casa.journeyContext.getDataForPage('enter-claim-reference-number');

      let result;

      try {
        if (skipValidation !== 'true') {
          const hashvalue = generateSHA512HashValue(claimData.claimReference);
          log.debug('Calling security number service');
          result = await postSecurityNumber(hashvalue, pageData.securityNumber);
        } else {
          log.debug(`Skipping security number service as skipValidation is ${skipValidation}`);
          result = {
            status: 200,
          };
        }

        if (result.status === 200) {
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            next();
          });
        } else {
          log.error(`result.status !== 200 it was ${result.status}`);
          const errorMessage = res.locals.t('security-number:validation.summary_try_again');
          const error = {
            securityNumber: [
              {
                field: 'securityNumber',
                fieldHref: '#f-securityNumber',
                focusSuffix: '',
                validator: 'required',
                inline: errorMessage,
                summary: errorMessage,
              }],
          };
          next(error);
        }
      } catch (e) {
        const resp = e.response;
        log.error(e);
        const errorMessage = res.locals.t('security-number:validation.summary_email');
        let errorSummary = res.locals.t('security-number:validation.summary_main');

        log.debug(`Catch block result.status = ${resp?.status}`);
        if (resp?.status === 401) {
          errorSummary += computeErrorSummary(req, res);
        } else if (resp?.status === 400) {
          errorSummary += computeErrorSummary(req, res);
        }

        const error = {
          securityNumber: [
            {
              field: 'securityNumber',
              fieldHref: '#f-securityNumber',
              focusSuffix: '',
              validator: 'required',
              inline: errorMessage,
              summary: errorSummary,
            }],
        };
        res.locals.errorPage = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          next(error);
        });
      }
    },
    preredirect: (req, res) => {
      // This is only called if they enter correct value, anything else does not redirect
      req.casa.journeyContext.setDataForPage('security-number', undefined);
      req.casa.journeyContext.removeValidationStateForPage('security-number');
      req.casa.journeyContext.setDataForPage('enter-claim-reference-number', undefined);
      req.casa.journeyContext.removeValidationStateForPage('enter-claim-reference-number');
      req.casa.journeyContext.setDataForPage('confirm-claim-reference-number', undefined);
      req.casa.journeyContext.removeValidationStateForPage('confirm-claim-reference-number');
      req.session.AUTH_STATE = 'AUTHENTICATED';
      req.session.save((err) => {
        if (err) {
          throw err;
        }
        res.redirect(`${WORKPLACE_CONTACT_URL}/about-claim`);
      });
    },
  },
});
