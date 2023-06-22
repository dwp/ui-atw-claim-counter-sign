const fieldValidators = require('../../field-validators/common/optional-validator');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/workplace-contact/incorrect-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      next();
    },
  },
});
