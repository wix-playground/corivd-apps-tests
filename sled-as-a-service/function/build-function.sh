#!/bin/bash
set -e

id=$(date +%s%N)
filename="sled-as-a-service-$id"
echo "Verify code is valid (eslint)"
npm install
echo "Switch to node version: 8"
unset npm_config_prefix
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh";
nvm install 8.10

rm -rf node_modules
rm -rf package-lock.json

echo "Install only non-dev dependencies"
npm install --production

echo "Start zipping $filename"
zip -r $filename node_modules/* index.js &> /dev/null

aws lambda update-function-code --function-name sled-as-a-service --zip-file fileb://$filename.zip --region us-east-1
echo "Done $filename"
