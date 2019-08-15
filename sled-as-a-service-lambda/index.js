const { replay } = require('sled-test-runner/dist/src/cli')

const replayForArtifact = event => replay({ artifact: event.artifact });

const actions = {
    replayForArtifact
}

exports.handler = async event => {
    const action = event.action || 'replayForArtifact'
    return actions[action](event)
} 
