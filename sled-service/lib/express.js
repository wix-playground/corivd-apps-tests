const { WixPublicHtmlInfoWebapp } = require('@wix/ambassador-wix-public-html-info-webapp/rpc');

function getPublishedRevision(req) {
  const { siteId } = req.query;
  // eslint-disable-next-line new-cap
  const service = WixPublicHtmlInfoWebapp().SiteRevisionsInfo()
  return service(req.aspects).getPublishedAndRcRevisions({ siteId })
}

module.exports = (app, context) => {

  app.get('/sites', (req, res) => {
    res.send(context.sites);
  });

  app.get('/rc', async (req, res) => {
    const { publishedRevision } = await getPublishedRevision(req);
    res.send({ publishedRevision });
  });

  return app;
};