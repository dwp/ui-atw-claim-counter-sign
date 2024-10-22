const setConsentCookie = require('../../utils/set-consent-cookie');
const removeGTMCookies = require('../../utils/remove-gtm-cookies');

module.exports = (consentCookieName, mountUrl, gtmDomain, useTLS) => (req, res) => {
  const { cookieConsent } = req.body;

  // Validation error, set messeage in session and redirect back to this page
  if (!cookieConsent || (cookieConsent !== 'reject' && cookieConsent !== 'accept')) {
    req.session.cookieConsentError = 'cookie-policy:field.cookieConsent.required';
    return req.session.save(() => res.redirect(req.url));
  }

  // Validation successful, set cookie and redirect back where they came from
  // via backto query string, if it exists
  setConsentCookie(req, res, consentCookieName, cookieConsent, mountUrl, useTLS);

  // If rejected, remove any GA cookies
  if (cookieConsent === 'reject') {
    removeGTMCookies(req, res);
  }

  if (req.query.backto) {
    const {
      pathname,
      search,
    } = new URL(String(req.query.backto), 'http://dummy.test/');
    const redirectBackTo = (pathname + search).replace(/\/+/g, '/')
      .replace(/[.:]+/g, '');
    return req.session.save(() => res.redirect(mountUrl.slice(0, -1) + redirectBackTo));
  }

  return req.session.save(() => res.redirect(mountUrl.slice(0, -1) + req.url));
};
