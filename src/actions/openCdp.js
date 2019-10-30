import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';

export default {
  // before and after can be omitted, but remain
  // here as an example
  before: () => {},
  operation: (user, { maker }) => {
    return maker
      .service('mcd:cdpManager')
      .openLockAndDraw('ETH-A', ETH(1), MDAI(1));
  },
  after: () => {},
  category: 'cdp'
};
