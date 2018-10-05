import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Sign an uploader transaction
 */
module.exports = () => {
  const ms = 10000;
  browser.waitForVisible('.header=Sign Transaction', ms);
  const signTransactionPasswordField = 'input[type=password]';
  checkIfElementExists(signTransactionPasswordField, false, 1);
  browser.setValue(signTransactionPasswordField, 'digixtest');
  browser.click('button=Sign Transaction');

  browser.waitForVisible('strong*=0x', ms);
  testData.jobId = browser.getText('strong');
  browser.click('button=Done');
};
