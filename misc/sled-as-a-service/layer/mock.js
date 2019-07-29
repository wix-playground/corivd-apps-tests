const { replay } = require('sled-test-runner/dist/src/cli')

async function entry() {
  return replay({artifact: 'corivd-apps-e2e-boilerplate', hash: 'bd28d6c'})
}

entry()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err)
  })