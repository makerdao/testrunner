export default {
  before: () => {},
  operation: (user, maker, currencies) => {
    // eslint-disable-line no-unused-vars
    // use dai.js to open a cdp for the user
    // create a proxy as necessary
    return maker
      .service('mcd:cdpManager')
      .openLockAndDraw('ETH-A', currencies.ETH(1), currencies.MDAI(1));
  },
  after: () => {},
  category: 'cdp'
};
