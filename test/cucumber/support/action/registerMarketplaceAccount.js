import faker from 'faker';
/**
 * Open the given URL
 * @param  {String}   type Type of navigation (url or site)
 * @param  {String}   page The URL to navigate to
 * @param  {Function} done Function to execute when finished
 */
module.exports = (type) => {
  /**
   * The URL to navigate to
   * @type {String}
   */
  // console.log('email type', type);
  let email;
  switch (type) {
    case 'new':
      email = faker.internet.email();
      break;
    case 'invalid':
      email = 'invalidEmail';
      break;
    default:
      email = 'admin@digix.global';
  }

  browser.setValue('[name="email"]', email);
};
