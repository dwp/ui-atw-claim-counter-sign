const setConsentCookie = require('../../utils/set-consent-cookie');
const removeGTMCookies = require('../../utils/remove-gtm-cookies');

module.exports = (consentCookieName, mountUrl, gtmDomain, useTLS) => (req, res) => {
  const { cookieConsent } = req.body;
  const redirectUrl = `${mountUrl}${req.url}`;
  const mountSlice = mountUrl.slice(0, -1)
  const mountSliceUrl = mountSlice + req.url;

  // Validation error, set messeage in session and redirect back to this page
  if (!cookieConsent || (cookieConsent !== 'reject' && cookieConsent !== 'accept')) {
    req.session.cookieConsentError = 'cookie-policy:field.cookieConsent.required';
    if(redirectUrl.includes('/review-claim')) {
      return req.session.save(() => res.redirect(redirectUrl));
    }
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
    const redirectBackUrl = mountSlice + redirectBackTo;
    if(redirectBackUrl.includes('/review-claim')){
      return req.session.save(() => res.redirect(redirectBackUrl));
    }
  }
  if(mountSliceUrl.includes('/review-claim')) {
    return req.session.save(() => res.redirect(mountSliceUrl));
  }
};
