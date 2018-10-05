/**
 * Open the given Provenance url and accept terms
 */
module.exports = () => {
  /**
   * The URL to navigate to
   * @type {String}
   */

  browser.url('https://localhost:3000/#/provenance');
  browser.waitForVisible('.modal');
  browser.execute(() => {
    document.querySelector('#overlayDiv').scroll(0, 100000);
  });
  browser.click('.modal .green.button');
};
