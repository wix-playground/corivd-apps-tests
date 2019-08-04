const bootstrap = require('@wix/wix-bootstrap-ng');
const CREATE_TOPIC = require('./lib/topics').GREETING;

bootstrap()
  .use(require('@wix/wix-bootstrap-greynode'), {createTopics: [{name: CREATE_TOPIC}]})
  .config('./lib/config')
  .express('./lib/express')
  .start();
