const testkit = require('@wix/wix-bootstrap-testkit'),
  greynodeTestkit = require('@wix/wix-greynode-testkit'),
  eventually = require('wix-eventually'),
  TOPICS = require('../lib/topics'),
  axios = require('axios'),
  {expect} = require('chai');

describe('sample application', () => {

  const app = testkit.server('.', {timeout: 20000});
  const greynode = greynodeTestkit(TOPICS.external).beforeAndAfter();

  before(() => app.start());

  after(() => app.stop());

  it('consumes message via greynode', async () => {
    const siteMessage = {
      appInstanceId: 'wham-bam',
      revision: 3
    };

    await greynode.produce(TOPICS.PUBLISH_RC, siteMessage);
    return eventually(async () => {
      const res = await axios.get(app.getUrl('/sites'));
      expect(res.data).to.deep.include(siteMessage);
    });
  });
});
