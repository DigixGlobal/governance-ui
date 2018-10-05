import path from 'path';
import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Set file from a folder into the specified element
 * @param  {String}   file  The file to be put
 * @param  {String}   folder    Folder location of the file in test folder
 * @param  {String}   element Element selector
 */
module.exports = (file, folder, element) => {
  checkIfElementExists(element);
  const filePath = path.join(__dirname, '..', '..', '..', folder, file);
  browser.chooseFile(element, filePath);
};
