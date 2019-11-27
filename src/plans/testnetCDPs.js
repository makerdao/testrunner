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
    ['user1', [['cdpOpen', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]],
    [
      'user1',
      [['cdpOpenAndBite', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user1',
      [['cdpOpenUnsafe', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    ['user2', [['cdpOpen', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]],
    [
      'user2',
      [['cdpOpenAndBite', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user2',
      [['cdpOpenUnsafe', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    ['user3', [['cdpOpen', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]],
    [
      'user3',
      [['cdpOpenAndBite', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user3',
      [['cdpOpenUnsafe', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    ['user4', [['cdpOpen', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]],
    [
      'user4',
      [['cdpOpenAndBite', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user4',
      [['cdpOpenUnsafe', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    ['user5', [['cdpOpen', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]],
    [
      'user5',
      [['cdpOpenAndBite', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ],
    [
      'user5',
      [['cdpOpenUnsafe', { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }]]
    ]
  ]
};
