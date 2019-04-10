cd ../governance-ui-components
git checkout deploy-production
rm -rf node_modules
rm package-lock.json
npm i

cd ../governance-ui
git checkout deploy-production
rm -rf node_modules
rm package-lock.json
npm i
npm run build
