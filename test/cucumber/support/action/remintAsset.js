import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Perform a remint of asset/assets
 * @param  {String}   type  Identifier for how many assets to be recasted
 */
module.exports = (type) => {
  const recastNumber = type === 'asset' ? 1 : 2;
  const checkBoxes = $$('.ui.checkbox');

  for (let i = 0; i < recastNumber; i++) {
    checkBoxes[i].click();
  }

  const ms = 10000;
  browser.click('button.red=Remint Asset');
  browser.click('div[name=remintReason]');
  browser.click('span=Change of mind');
  browser.waitForVisible('button.green=Remint Asset', ms);
  browser.click('button.green=Remint Asset');
};
