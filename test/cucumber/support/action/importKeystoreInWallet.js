import path from 'path';

/**
 * Import keystore wallet on element
 * @param  {String}   file file to be imported
 * @param  {String}   password the key to descrypt the keystore
 */
module.exports = (file, password) => {
  browser.url('https://localhost:3000/#/wallet');
  browser.refresh(); // to remove existing wallet if there is any
  browser.click('button=Import');

  const keystorePath = path.join(__dirname, '..', '..', '..', 'keystores', file);
  browser.chooseFile('[type=file]', keystorePath);

  browser.setValue('[type=password]', password);
  browser.click('button=Unlock Wallet');

  const ms = 20000;
  browser.waitForVisible('.header=Import Unlocked Wallet', ms);
  const name = file.split('.json')[0];
  browser.setValue('[name=name]', name);
  browser.setValue('[name=password]', password);
  browser.setValue('[name=confirmPassword]', password);
  browser.click('button=OK');

  browser.waitForVisible(`.content*=${name}`, ms);
};
