const bootstrap = require('@wix/wix-bootstrap-ng');

bootstrap()
  .use(require('@wix/wix-bootstrap-greynode'))
  .config('./lib/config')
  .express('./lib/express')
  .start();
