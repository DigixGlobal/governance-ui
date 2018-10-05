import path from 'path';
/**
 * Input information for a specific custodian delivery order
 * @param  {Number}   number  Order number to be filled
 */
module.exports = (number) => {
  const imagesDir = path.join(__dirname, '..', '..', '..', 'images');
  const receipt = path.join(imagesDir, 'custodian_receipt.pdf');
  const dux = path.join(imagesDir, 'dux.jpg');

  browser.chooseFile(`/html/body/div[4]/div/div[2]/form/div/div[${number}]/div[2]/div[1]/div/div[1]/div/input`, receipt);
  browser.chooseFile(`/html/body/div[4]/div/div[2]/form/div/div[${number}]/div[2]/div[3]/div/div[1]/div/input`, dux);
};
