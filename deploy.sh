cd ../governance-ui-components
git checkout www-kovan-deploy
rm -rf node_modules
rm package-lock.json
npm i

cd ../governance-ui
git checkout www-kovan-deploy
rm -rf node_modules
rm package-lock.json
npm i
npm run build:kovan
