const { replay } = require('sled-test-runner/dist/src/cli')

exports.handler = async ({artifact, hash}) => {
  global.meLambda = true;
  return replay({artifact, hash});
}
