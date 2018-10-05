/**
 * Verify order
 */
module.exports = () => {
  browser.setValue('/html/body/div[4]/div/div[2]/form/div/div[1]/div[1]/div/input', testData.jobId); // change to selector if possible instead of XPath
  browser.pause(3000);
  browser.click('button=Search');
};
