import { stringToBytes } from '../helpers/utils';

export default {
  // before and after can be omitted, but remain
  // here as an example
  before: () => {},
  operation: async (user, maker) => {
    return maker
      .service('smartContract')
      .getContract('MCD_JUG')
      .drip(stringToBytes('ETH-A'));
  },
  after: () => {},
  category: 'cdp'
};
