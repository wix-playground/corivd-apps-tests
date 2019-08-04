const testkit = require('@wix/wix-bootstrap-testkit'),
  greynodeTestkit = require('@wix/wix-greynode-testkit'),
  eventually = require('wix-eventually'),
  TOPICS = require('../lib/topics'),
  axios = require('axios'),
  {expect} = require('chai'),
  { AmbassadorTestkit } = require('@wix/ambassador-testkit'),
  { WixPublicHtmlInfoWebapp } = require('@wix/ambassador-wix-public-html-info-webapp/rpc');

describe('sample application', () => {

  const app = testkit.server('.', {timeout: 20000});
  const greynode = greynodeTestkit(TOPICS.external).beforeAndAfter();
  const ambassadorTestkit = new AmbassadorTestkit(); // create new instance of the testkit
  
  ambassadorTestkit.beforeAndAfter();

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

  it('returns rc revision', async () => {
    const siteId = 'xyz'
    const publicHtmlInfoStub = ambassadorTestkit.createStub(WixPublicHtmlInfoWebapp);
    // eslint-disable-next-line new-cap
    publicHtmlInfoStub.SiteRevisionsInfo().getPublishedAndRcRevisions
      .when({ siteId })
      .resolve({ publishedRevision: 42 });

    const res = await axios.get(app.getUrl(`/rc?siteId=${siteId}`));
    expect(res.data).to.deep.equal({ publishedRevision: 42 });
  });

});
