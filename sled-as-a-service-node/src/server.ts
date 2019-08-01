import { Router } from 'express';
import { hot } from 'bootstrap-hot-loader';
import * as wixExpressCsrf from '@wix/wix-express-csrf';
import * as wixExpressRequireHttps from '@wix/wix-express-require-https';
import { replay } from 'sled-test-runner/dist/src/cli';
import wixExpressTimeout from '@wix/wix-express-timeout';

// This function is the main entry for our server. It accepts an express Router
// (see http://expressjs.com) and attaches routes and middlewares to it.
//
// `context` is an object with built-in services from `wix-bootstrap-ng`. See
// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-ng).
export default hot(module, (app: Router, context) => {
  // We load the already parsed ERB configuration (located at /templates folder).
  const config = context.config.load('sled-as-a-service-node');

  // Attach CSRF protection middleware. See
  // https://github.com/wix-platform/wix-node-platform/tree/master/express/wix-express-csrf.
  app.use(wixExpressCsrf());

  // Require HTTPS by redirecting to HTTPS from HTTP. Only active in a production environment.
  // See https://github.com/wix-platform/wix-node-platform/tree/master/express/wix-express-require-https.
  app.use(wixExpressRequireHttps);

  // Attach a rendering middleware, it adds the `renderView` method to every request.
  // See https://github.com/wix-private/fed-infra/tree/master/wix-bootstrap-renderer.
  app.use(context.renderer.middleware());

  // Define a route to render our initial HTML.
  app.get('/', (req, res) => {
    // Extract some data from every incoming request.
    const renderModel = getRenderModel(req);

    // Send a response back to the client.
    res.renderView('./index.ejs', renderModel);
  });

  const _greynode: any[] = [];

  context.greynode.aConsumer({topic: 'html-site-rc-published-events', groupId: context.app.name}, (message, metadata) => {
    _greynode.push(JSON.stringify(message))
});

  app.use('/sled/replay', wixExpressTimeout(60 * 1000));

  app.get('/sled/replay', async (req, res) => {
    const args = { artifact: 'corivd-apps-e2e-boilerplate', hash: 'bd28d6c' };
    await replay(args);
    res.send(`👍 executed tests on ${JSON.stringify(args, null, 2)}`);
  });

  app.get('/sled/greynode-dump', async (req, res) => {
    res.send(JSON.stringify(_greynode));
  });

  function getRenderModel(req) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
});
