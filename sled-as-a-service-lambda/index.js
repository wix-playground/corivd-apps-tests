const { DynamoDB } = require('aws-sdk');
// const AWS = require('aws-sdk/global');
const { replay } = require('sled-test-runner/dist/src/cli')

const replayForArtifact = async event => replay({ artifact: event.artifact });

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

const writeArtifactTetsResult = async event => {
    const {artifact, success, rcRevision} = event
    const date = new Date().toLocaleString()
    var ddb = new DynamoDB({apiVersion: '2012-08-10', region: 'us-east-1'});


    var params = {
        Item: {
         "artifact": {
           S: artifact
          }, 
          "id": {
            S: uuidv4(),
           }, 
           "rcRevision": {
            S: rcRevision,
           }, 
         "success": {
           S: `${success}`
          }, 
         "date": {
           S: date
          }
        }, 
        // ReturnConsumedCapacity: "TOTAL", 
        TableName: "sled_rc_execution_history"
       };
    //   const params = {
    //     TableName: 'sled_rc_execution_history',
    //     Item: {
    //         Item: {
    //             artifact: {
    //               S: artifact
    //             },
    //             date: {
    //                 S: `${date}`
    //               },
    //             result: {
    //                 S: `${result}`
    //               },
    //           }
    //         }
    //   };
    const saveResult = await ddb.putItem(params).promise()
    console.log(`save result`)
    console.log(JSON.stringify(saveResult, null, 4))
}

const actions = {
    writeArtifactTetsResult,
    replayForArtifact
}

exports.handler = async event => {
    const action = event.action || 'replayForArtifact'
    const result = await actions[action](event)
    console.log(`got result from action`)
    console.log(JSON.stringify(result, null, 4))
    return result

} 
