export default {
  before: () => {},
  operation: (user, maker) => { // eslint-disable-line no-unused-vars
    // use dai.js to open a cdp for the user
    // create a proxy as necessary
  },
  after: () => {
    // verify that the cdp was created
  },
  category: 'cdp'
};
