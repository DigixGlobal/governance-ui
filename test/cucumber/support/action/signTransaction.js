import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Sign a transaction
 */
module.exports = () => {
  const ms = 10000;
  browser.waitForVisible('.header=Sign Transaction', ms);
  const signTransactionPasswordField = 'input[type=password]';
  checkIfElementExists(signTransactionPasswordField, false, 1);
  browser.setValue(signTransactionPasswordField, 'digixtest');
  browser.click('button=Sign Transaction');

  browser.waitForVisible('div*=Transaction was successful!', ms);
  browser.click('button=Done');
};
