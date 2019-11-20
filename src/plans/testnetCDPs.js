import { ETH } from '@makerdao/dai-plugin-mcd';
export default {
  actors: {
    user1: 'testAccounts',
    user2: 'testAccounts',
    user3: 'testAccounts',
    user4: 'testAccounts',
    user5: 'testAccounts'
  },
  actions: [
    [
      'user1',
      [['cdpOpen', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user1',
      [['cdpOpenAndBite', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user1',
      [['cdpOpenUnsafe', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user2',
      [['cdpOpen', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user2',
      [['cdpOpenAndBite', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user2',
      [['cdpOpenUnsafe', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user3',
      [['cdpOpen', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user3',
      [['cdpOpenAndBite', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user3',
      [['cdpOpenUnsafe', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user4',
      [['cdpOpen', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user4',
      [['cdpOpenAndBite', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user4',
      [['cdpOpenUnsafe', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user5',
      [['cdpOpen', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user5',
      [['cdpOpenAndBite', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user5',
      [['cdpOpenUnsafe', 0, { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ]
  ]
};
