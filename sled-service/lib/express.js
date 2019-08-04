module.exports = (app, context) => {

  app.get('/sites', (req, res) => {
    res.send(context.sites);
  });

  return app;
};