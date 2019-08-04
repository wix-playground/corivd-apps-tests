/*eslint no-unused-vars: 1*/
const TOPICS = require('./topics');

module.exports = context => {

  const sites = [];
  context.greynode.aConsumer({topic: TOPICS.PUBLISH_RC, groupId: context.app.name}, (site, aspects) => sites.push(site));

  return {sites};
};
