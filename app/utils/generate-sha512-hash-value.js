const crypto = require('crypto');

const generateSHA512HashValue = (clientRef) => {
  const hashvalue = crypto.createHash('sha512')
    .update(clientRef)
    .digest('hex');
  return hashvalue;
};
module.exports = generateSHA512HashValue;
