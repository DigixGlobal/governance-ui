import path from 'path';

/**
 * Import keystore on element
 * @param  {String}   file file to be imported
 * @param  {String}   element Element where to put the file
 */
module.exports = (file, element) => {
  const keystorePath = path.join(__dirname, '..', '..', '..', 'keystores', file);
  browser.chooseFile(element, keystorePath);
};
