const exec = require('child_process').exec;

const build_cmd = `bash build-function.sh`

const invoke_cmd = `aws lambda invoke --function-name sled-as-a-service --log-type Tail --payload '{"artifact":"corivd-apps-e2e-boilerplate"}' --region us-east-1 blah.txt`;

function execute(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(stdout)
        });
    });
};

function parseLog(raw) {
    let buff = new Buffer(JSON.parse(raw).LogResult, 'base64');
    return buff.toString('ascii');
}

async function main() {
    if (process.argv[2] === '--build') {
        console.log('build and publish new function...')
        try {
            const out = await execute(build_cmd);
            console.log(`=== build output ===\n\n${out}\n==============`)
        } catch (error) {
            console.error(error)
            return;
        }
    }
    console.log('invoking function...')
    const raw = await execute(invoke_cmd);
    const result = parseLog(raw)
    console.log(`=== function execution output ===\n\n${result}\n==============`)
}

main();

