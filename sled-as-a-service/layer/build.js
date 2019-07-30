const shelljs = require('shelljs');
const fs = require('fs-extra');
const path = require('path');

function getPackageName() {
  const {name} = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
  return name;
}

const target = '../dist';

function buildLayer(name) {
  const sandbox = `${name}-tmp-${Math.ceil(Math.random() * 100000)}`
  shelljs.exec(`mkdir ${sandbox}`);
  shelljs.exec(`cp ${name}.json ${sandbox}/package.json`);
  shelljs.cd(sandbox)
  shelljs.exec('npm install --production');
  shelljs.exec('npm pack');
  const packageName = getPackageName();
  shelljs.exec(`tar -xf ${packageName}-1.0.0.tgz`);
  fs.moveSync('package', 'nodejs');
  fs.removeSync('nodejs/package.json');
  const zipBaseName = packageName;
  shelljs.exec(`zip -r ${zipBaseName} nodejs &> /dev/null`);
  const f = `${zipBaseName}.zip`;
  console.log(`all done! see ${f}
  \ntotal zip size: ` + shelljs.exec(`du -sh ${f}`) + 
  `\ntotal zip size: ` + shelljs.exec(`du -sh nodejs`));
  shelljs.exec(`mkdir ${target} || true`);
  shelljs.exec(`mv ${f} ${target}`);
}

buildLayer('sled-as-a-service-core');
