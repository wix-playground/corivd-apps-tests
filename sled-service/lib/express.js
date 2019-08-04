module.exports = (app, context) => {

  app.get('/sites', (req, res) => {
    res.send(context.sites);
  });

  app.get('/hello/:name', (req, res) => {
    context.greet(req.params.name, req.aspects).then(() => res.sendStatus(201));
  });

  return app;
};