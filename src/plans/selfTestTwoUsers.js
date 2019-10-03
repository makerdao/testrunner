// TODO add some write operations to this plan when they're complete, to verify

export default {
  actors: {
    user1: 'defaultAccount',
    user2: 'selfTestAccount8'
  },
  actions: [
    ['user1', 'showAddress'],
    ['user1', 'checkEthBalance'],
    ['user2', 'showAddress'],
    ['user2', 'checkEthBalance'],
    ['user1', 'showAddress'],
    ['user1', 'checkEthBalance'],
    ['user2', 'showAddress'],
    ['user2', 'checkEthBalance']
  ]
};
