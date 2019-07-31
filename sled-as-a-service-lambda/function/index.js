const { replay } = require('sled-test-runner/dist/src/cli')

exports.handler = async ({ artifact, hash }) => replay({ artifact, hash });
