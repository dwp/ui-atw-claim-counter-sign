module.exports = (casaApp) => {
  const problemWithService = (req, res) => res.render('casa/errors/500.njk');

  casaApp.router.get('/problem-with-service', problemWithService);

  return problemWithService;
};
