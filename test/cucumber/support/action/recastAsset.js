import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Perform a recast of asset/assets
 * @param  {String}   type  Identifier for how many assets to be recasted
 */
module.exports = (type) => {
  const recastNumber = type === 'asset' ? 1 : 2;
  const checkBoxes = $$('.ui.checkbox');

  for (let i = 0; i < recastNumber; i++) {
    checkBoxes[i].click();
  }

  browser.click('button=Recast');
  const emailInputFieldElement = 'input[name=email]';
  const passwordInputFieldElement = 'input[name=password]';
  checkIfElementExists(emailInputFieldElement, false, 1);
  checkIfElementExists(passwordInputFieldElement, false, 1);
  browser.setValue(emailInputFieldElement, 'admin@digix.global');
  browser.setValue(passwordInputFieldElement, 'digixglobal');
  browser.click('button=Log In');
  const ms = 10000;
  browser.waitForVisible('.dimmer.transition.visible.active', ms, true);
  browser.waitForVisible('button.disabled=Recast', ms, true);
  browser.click('button=Recast');

  const tncCheckboxes = $$('label*=I agree to');
  tncCheckboxes.forEach(checkbox => checkbox.click());

  const confirmButton = 'button=Confirm Recast';
  browser.waitForVisible(confirmButton, ms);
  browser.click(confirmButton);
};
