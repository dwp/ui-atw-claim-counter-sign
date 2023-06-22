module.exports = (casaApp) => {
  const feedback = (req, res) => {
    const { referrer } = req.query;
    res.locals.referrerUrl = referrer.replace(/\/+/g, '/')
      .replace(/[.:]+/g, '');

    res.locals.hideBackButton = 'true';
    return res.render('pages/feedback/help-us-improve-this-service.njk');
  };

  casaApp.router.get('/feedback', feedback);

  return feedback;
};
