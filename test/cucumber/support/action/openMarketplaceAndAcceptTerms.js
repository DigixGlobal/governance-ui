/**
 * Open the given URL
 * @param  {String}   type Type of navigation (url or site)
 * @param  {String}   page The URL to navigate to
 * @param  {Function} done Function to execute when finished
 */
module.exports = () => {
  /**
   * The URL to navigate to
   * @type {String}
   */

  browser.url('https://localhost:3000/#/marketplace');
  browser.waitForVisible('.modal');
  browser.execute(() => {
    document.querySelector('#overlayDiv').scroll(0, 100000);
  });
  browser.click('.modal .green.button');
};
