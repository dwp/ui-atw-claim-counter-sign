const fieldValidators = require('../../field-validators/common/search-for-address-of-company');
const logger = require('../../../logger/logger');

const log = logger('definitions:pages.common.search-for-address-of-company');

const addressLinePostcode = /, ?[A-Z0-9]{2,4} [0-9][A-Z]{2}$/i;

const postcodeWP = 'company-postcode';
const manualEntryWP = 'enter-company-address';
const sourceAddressWP = 'company-address-search';
const hiddenAddressWP = '__hidden_address__';

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/common/search-for-address-of-company.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      let editUrl = '';
      if (req.inEditMode) {
        log.info('Address edit mode');
        editUrl = `?edit=&editorigin=${req.editOriginUrl}`;
        req.casa.journeyContext.setValidationErrorsForPage('check-your-answers', undefined);
      }

      // Grab addresses from the postcode-lookup page
      const { addresses = [] } = req.casa.journeyContext.getDataForPage(postcodeWP);

      // Get formatted postcode for display on page from first result
      if (addresses.length > 0) {
        res.locals.postcode = addresses[0].postcode;
      } else {
        res.locals.hideContinueButton = true;
        res.locals.postcode = req.casa.journeyContext.getDataForPage(postcodeWP).postcode;
      }

      // Map address response to a formatted list appropriate for the govukSelect()
      // Nunjucks macro
      const pageData = req.casa.journeyContext.getDataForPage(req.casa.journeyWaypointId);
      res.locals.addresses = addresses.map((address) => ({
        value: address.uprn,
        // To increase readability of the address line we strip out the postcode
        text: address.singleLine.replace(addressLinePostcode, ''),
        // Select previous selection by default
        selected: pageData ? String(address.uprn) === String(pageData.uprn) : false,
      }));

      // Add default select entry
      res.locals.addresses.unshift({
        value: 'select-address',
        text: req.i18nTranslator.t('search-for-address-of-company:addressFound', addresses.length),
      });

      // Links to change postcode, or go to manual addresses entry
      res.locals.changePostcodeUrl = `${postcodeWP}${editUrl}#f-postcode`;
      if (editUrl.length > 0) {
        editUrl = editUrl.replace('?', '&');
      }
      res.locals.manualAddressUrl = `?skipto=${manualEntryWP}${editUrl}`;

      res.locals.companyName = req.casa.journeyContext.getDataForPage(
        'company-organisation-name',
      ).companyOrganisationName;
      next();
    },
    postvalidate: (req, res, next) => {
      const { addresses = [] } = req.casa.journeyContext.getDataForPage(postcodeWP);
      const { uprn } = req.casa.journeyContext.getDataForPage(sourceAddressWP);

      if (addresses.length < 1 || uprn === undefined) {
        throw new Error(`${postcodeWP} or ${sourceAddressWP} not saved properly`);
      }

      // Find matching address from address service list
      const address = addresses.find((addr) => String(addr.uprn) === String(uprn));

      // Convert address string to address object which can be generically formatted
      const addressArray = address.singleLine
        .replace(addressLinePostcode, '')
        .split(',');

      let addressObj;
      if (addressArray.length > 4) {
        const last3Lines = addressArray.slice(-3)
          .map((line) => line.trim());
        const withoutLast3 = addressArray.slice(0, -3)
          .map((line) => line.trim());

        addressObj = {
          address1: withoutLast3.join(', '),
          address2: last3Lines[0],
          address3: last3Lines[1],
          address4: last3Lines[2],
        };
      } else {
        addressObj = addressArray.reduce((obj, line, index) => ({
          ...obj,
          [`address${index + 1}`]: line.trim(),
        }), {});
      }

      // Re-add postcode and uprn as specifically named properties
      addressObj.postcode = address.postcode;

      // Add address object to HIDDEN_ADDRESS_PAGE
      req.casa.journeyContext.setDataForPage(hiddenAddressWP, {
        singleLine: address.singleLine,
        addressDetails: addressObj,
        addressFrom: 'select',
        uprn,
      });

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        next();
      });
    },
  },
});
