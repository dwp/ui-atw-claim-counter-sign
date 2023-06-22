module.exports = (consentCookieName, sessionCookieName, sessionTtl) => (req, res) => {
  res.render('pages/cookies/cookie-details.njk', {
    cookiePolicyUrl: 'cookie-policy',
    sessionMinutes: sessionTtl,
    consentCookieName,
    sessionCookieName,
  });
};
