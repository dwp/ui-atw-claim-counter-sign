const qs = require('querystring');
const setConsentCookie = require('../utils/set-consent-cookie');
const removeGTMCookies = require('../utils/remove-gtm-cookies');

module.exports = (
  app,
  consentCookieName,
  cookiePolicyWaypoint,
  cookieConsentWaypoint,
  gtmDomain,
  mountUrl = '/',
  proxyMountUrl = mountUrl,
  useTLS = false,
) => {
  const sanitiseUrl = (url) => url.replace(/\/+/g, '/');

  // URL to cookie policy page
  const cookiePolicyUrl = `${mountUrl}${cookiePolicyWaypoint}`;

  // Set template options for cookie consent banner
  app.use((req, res, next) => {
    // Get cookie banner flash messages (did you accept / reject)
    if (req.session) {
      res.locals.cookieChoiceMade = req.session.cookieChoiceMade;
      req.session.cookieChoiceMade = undefined;
    }
    res.locals.cookieDetailsUrl = `${mountUrl}cookie-details`;
    res.locals.acessibilityStatementUrl = `${mountUrl}accessibility-statement`;

    // Add current consent cookie value to templates
    if (req.cookies[consentCookieName]) {
      res.locals.cookieMessage = req.cookies[consentCookieName];
    } else {
      res.locals.cookieMessage = 'unset';
    }

    // Url to submit consent to (used in banner)
    res.locals.cookieConsentSubmit = cookieConsentWaypoint;

    // Set backto query
    const {
      pathname,
      search,
    } = new URL(String(req.url), 'http://dummy.test/');
    const currentUrl = sanitiseUrl(pathname + search);

    // If already on cookie policy page, don't need set backto again
    if (pathname === cookiePolicyUrl) {
      res.locals.cookiePolicyUrl = currentUrl;
    } else {
      res.locals.cookiePolicyUrl = `${cookiePolicyUrl}?${qs.stringify({ backto: currentUrl })}`;
    }
    res.locals.currentUrl = mountUrl.slice(0, -1) + currentUrl;

    // Set referrer policy
    res.set('Referrer-Policy', 'same-origin');

    next();
  });

  // Handle setting consent cookie from banner submission
  app.post(`${proxyMountUrl}${cookieConsentWaypoint}`, (req, res) => {
    const { cookieConsent } = req.body;

    if (cookieConsent === 'reject' || cookieConsent === 'accept') {
      setConsentCookie(req, res, consentCookieName, cookieConsent, mountUrl, useTLS);
    }
    // If rejected, remove any GA cookies
    if (cookieConsent === 'reject') {
      removeGTMCookies(req, res, gtmDomain);
    }

    const referrer = req.get('Referrer');
    if (referrer && !/^javascript:/.test(referrer)) {
      const {
        pathname,
        search,
      } = new URL(referrer, 'http://dummy.test/');
      const redirectBackTo = sanitiseUrl(pathname + search);
      if (redirectBackTo.includes('/review-claim')) {
        req.session.save(() => res.redirect(redirectBackTo));
      }
    } else {
      res.redirect(mountUrl);
    }
  });
};
