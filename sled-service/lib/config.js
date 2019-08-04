/*eslint no-unused-vars: 1*/
const TOPICS = require('./topics');

module.exports = context => {

  const sites = [];
  context.greynode.aConsumer({topic: TOPICS.CREATED_SITES, groupId: context.app.name}, (site, aspects) => sites.push(site));
  const producer = context.greynode.aProducer(TOPICS.GREETING);
  const greet = (name, aspects) => producer.produce({hello: name}, aspects);

  return {sites, greet};
};
