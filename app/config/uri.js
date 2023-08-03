const { mountURL } = require('./config-mapping');

const WORKPLACE_CONTACT_URL = `${mountURL}confirmer`;
const WORKPLACE_CONTACT_CONTEXT_PATH = '/confirmer';
const AUTH_URL = `${mountURL}auth`;
const AUTH_CONTEXT_PATH = '/auth';
const PUBLIC_URL = `${mountURL}public`;
const PUBLIC_CONTEXT_PATH = '/public';

module.exports = {
  WORKPLACE_CONTACT_URL,
  WORKPLACE_CONTACT_CONTEXT_PATH,
  AUTH_URL,
  AUTH_CONTEXT_PATH,
  PUBLIC_URL,
  PUBLIC_CONTEXT_PATH,
};
