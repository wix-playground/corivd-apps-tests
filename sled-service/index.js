const bootstrap = require('@wix/wix-bootstrap-ng');

bootstrap()
  .use(require('@wix/wix-bootstrap-greynode'))
  .use(require('@wix/ambassador/runtime/rpc'))
  .config('./lib/config')
  .express('./lib/express')
  .start();
