const fieldValidators = require('../../field-validators/claim-summary');
const {
  claimTypes,
  claimTypesSetKey
} = require('../../../config/claim-types');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/claim-summary.njk',
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
      } = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');
      if (claimType === claimTypesSetKey.TIW) {
        res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
          .padStart(7, '0')}`;
      } else {
        res.locals.claimReference = `${claimTypes[claimType]}${claimNumber.toString()
          .padStart(8, '0')}`;
      }
      res.locals.typeOfClaim = claimTypes[claimType];
      res.locals.supportWorkerName = req.casa.journeyContext.getDataForPage('__hidden_user_claim__').nameOfSupport;
      res.locals.claimData = req.casa.journeyContext.getDataForPage('__hidden_user_claim__');

      let claimsArray = Object.values(res.locals.claimData.claim);
      let monthYear = [];
      let daysOfSupport = [];
      const daysOfSupportArray = [];
      
      for (let i = 0; i < claimsArray.length; i++) {
        monthYear.push(claimsArray[i].monthYear);
        for (let j = 0; j < claimsArray[i].claim.length; j++) {
          daysOfSupport.push(claimsArray[i].claim[j].dayOfSupport);
        }
      }

      //Creating 2 dimensional array
      for ( let i = 0; i < monthYear.length; i++) {
        for (let k = 0; k < claimsArray[i].claim.length; k++) {
          daysOfSupportArray[i] = [];
        }
      }

      let j = 0;
      //Inserting values in 2 dimensional array
      for ( let i = 0; i < monthYear.length; i++) {
        for ( let k = 0; k < claimsArray[i].claim.length; k++ ) {
          const createDate = new Date (monthYear[i].yyyy, monthYear[i].mm -1, daysOfSupport[j]);
          const dayOfWeek = createDate.getDay();

          const dateDisplay = {
            'day': daysOfSupport[j],
            'weekday' : dayOfWeek,
            'month' : monthYear[i].mm
          }

          daysOfSupportArray[i][k] = dateDisplay;
          j++;
        };
      }

      res.locals.daysOfSupport = daysOfSupportArray;

      next();
    },
  },
});
