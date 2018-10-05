import faker from 'faker';
import path from 'path';
/**
 * Input information for a specific vendor order
 * @param  {Number}   number  Order number to be filled
 */
module.exports = (number) => {
  browser.setValue(`[name=serial${number}]`, faker.random.alphaNumeric(6));
  const imagesDir = path.join(__dirname, '..', '..', '..', 'images');
  const assayCard = path.join(imagesDir, 'assay_card.jpg');
  const image = path.join(imagesDir, 'image.jpg');
  const receipt = path.join(imagesDir, 'receipt.jpg');

  browser.chooseFile(`/html/body/div[4]/div/div[2]/form/div/div[${number}]/div[4]/div[1]/div/div[1]/div/input`, receipt);
  browser.chooseFile(`/html/body/div[4]/div/div[2]/form/div/div[${number}]/div[4]/div[2]/div/div[1]/div/input`, image);
  browser.chooseFile(`/html/body/div[4]/div/div[2]/form/div/div[${number}]/div[4]/div[3]/div/div[1]/div/input`, assayCard);
};
