const fs = require('fs');
const tunnel = require('tunnel');
const axios = require('axios');
const fieldValidators = require('../../field-validators/common/postcode-of-company');
const removeAllSpaces = require('../../../utils/remove-all-spaces');
const formatPostcode = require('../../../utils/format-postcode');
const logger = require('../../../logger/logger');
const config = require('../../../config/config-mapping');

const log = logger('definitions:pages.common.postcode-of-company');

const proxy = config.addressLookup.proxy === null ? null : new URL(config.addressLookup.proxy);
const proxytunnel = config.addressLookup.proxy === null ? null
  : new tunnel.httpsOverHttp({
    ca: [fs.readFileSync('certs/ca.pem')],
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
    proxy: {
      host: proxy.hostname,
      port: proxy.port,
    },
  });

module.exports = () => ({
  view: 'pages/common/postcode-of-company.njk',
  fieldValidators,
  hooks: {
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        log.debug('inEditMode preredirect');

        req.casa.journeyContext.setDataForPage('company-address-search', undefined);
        req.casa.journeyContext.setDataForPage('enter-company-address', undefined);
        req.casa.journeyContext.setValidationErrorsForPage('check-your-answers', undefined);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(
            `company-address-search?edit=&editorigin=${req.editOriginUrl}`,
          );
        });
      } else {
        log.debug('Not inEditMode preredirect');
        next();
      }
    },
    prerender: (req, res, next) => {
      if (req.inEditMode) {
        log.debug('inEditMode');
        const { postcode } = req.casa.journeyContext.getDataForPage(
          '__hidden_address__',
        ).addressDetails;
        req.casa.journeyContext.setDataForPage('company-postcode', { postcode });
      }
      res.locals.BUTTON_TEXT = res.locals.t(`${'postcode-of-company'}:findAddressButton`);
      res
        .locals.companyName = req.casa.journeyContext.getDataForPage(
          'company-organisation-name',
        ).companyOrganisationName;

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        next();
      });
    },
    pregather: (req, res, next) => {
      req.body.postcode = removeAllSpaces(req.body.postcode);
      next();
    },
    postvalidate: async (req, res, next) => {
      const data = req.casa.journeyContext.getDataForPage(req.casa.journeyWaypointId);
      const postcode = formatPostcode(data.postcode);
      log.debug(`Searching for ${postcode}`);

      try {
        const result = await axios({
          httpsAgent: proxytunnel,
          proxy: false,
          method: 'get',
          url: `/${config.addressLookup.contextPath}/api/v2/lookup/address`,
          baseURL: config.addressLookup.url,
          params: {
            postcode: postcode,
            excludeBusiness: false
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (result.status === 200) {
          log.debug('location-service was 200');
          const addresses = result.data.data;
          if (addresses.length === 0) {
            log.debug('Successfully looked up addresses. Got 0 results going to next page');
            req.casa.journeyContext.setDataForPage(req.casa.journeyWaypointId, Object.assign(data, {
              lookup_attempted: true,
              addresses: [],
            }));
            req.session.save((err) => {
              if (err) {
                throw err;
              }
              log.debug('location-service 200 length === 0 next()');
              next();
            });
          } else {
            log.debug('location-service 200 length !== 0');
            // Extract only the parts of addresses we need to avoid storing large
            // volumes of data in session
            const filteredAddresses = addresses.reduce((acc, address) => {
              if (address.singleLine && address.singleLine !== '') {
                acc.push({
                  uprn: address.uprn,
                  postcode: address.postcode,
                  singleLine: address.singleLine,
                });
              }
              return acc;
            }, []);

            log.debug(`Successfully looked up addresses. 
              Got ${addresses.length} results 
              (${filteredAddresses.length} filtered)`);

            req.casa.journeyContext.setDataForPage(req.casa.journeyWaypointId, Object.assign(data, {
              lookup_attempted: true,
              addresses: filteredAddresses,
            }));
            req.session.save((err) => {
              if (err) {
                throw err;
              }
              log.debug('location-service 200 length !== 0 next()');
              next();
            });
          }
        }
      } catch (e) {
        log.debug('location-service catch');
        const resp = e.response;
        log.error(e);
        if (resp?.status === 404) {
          // Go to next page but with no address found
          log.warn('No address found for this url got 404 from address service');
          req.casa.journeyContext.setDataForPage(req.casa.journeyWaypointId, Object.assign(data, {
            lookup_attempted: true,
            addresses: [],
          }));
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            log.debug('location-service 404 next()');
            next();
          });
        } else {
          log.debug(`location-service not 404 status was ${resp?.status}`);
          const message = 'Error getting addresses – try again.';

          const error = {
            files: [
              {
                field: 'postcode',
                fieldHref: '#f-postcode',
                focusSuffix: '',
                validator: 'required',
                inline: message,
                summary: message,
              }],
          };
          log.debug(`location-service not 404 status was ${resp?.status} next()`);
          next(error);
        }
      }
    },
  },
});
