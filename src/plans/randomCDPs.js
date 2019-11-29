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
    [['user1', 'user2', 'user3'], 'cdpOpenRandom'],
    [
      ['user4', 'user5'],
      [['cdpOpenAndBite', { collateral: ETH(1), ilk: 'ETH-A' }]]
    ],
    [
      ['user1', 'user2', 'user3', 'user4', 'user5'],
      [['cdpOpenUnsafe', { collateral: ETH(1), ilk: 'ETH-A' }]]
    ]
  ]
};
