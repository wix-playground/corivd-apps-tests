const testkit = require('@wix/wix-bootstrap-testkit'),
  greynodeTestkit = require('@wix/wix-greynode-testkit'),
  eventually = require('wix-eventually'),
  TOPICS = require('../lib/topics'),
  axios = require('axios'),
  {expect} = require('chai');

describe('sample application', () => {

  const app = testkit.server('.', {timeout: 20000});
  const greynode = greynodeTestkit(TOPICS.external).beforeAndAfter();
  const consumer = greynode.consume(TOPICS.GREETING);

  before(() => app.start());

  after(() => app.stop());

  it('consumes message via greynode', async () => {
    const siteMessage = {
      id: 1,
      name: 'my-site'
    };

    await greynode.produce(TOPICS.CREATED_SITES, siteMessage);
    return eventually(async () => {
      const res = await axios.get(app.getUrl('/sites'));
      expect(res.data).to.deep.include(siteMessage);
    });
  });

  it('produces message via greynode', async () => {
    await consumer.start();
    await axios.get(app.getUrl('/hello/Lenin'));
    return eventually(() => expect(consumer.messages).to.deep.include({hello: 'Lenin'}));
  });
});
