export default {
  actors: {
    user1: 'selfTestUser',
    user2: 'selfTestUser',
    user3: 'selfTestUser',
    user4: 'selfTestUser',
    user5: 'selfTestUser',
    user6: 'selfTestUser',
    user7: 'selfTestUser',
    user8: 'selfTestUser',
    user9: 'selfTestUser',
    user10: 'selfTestUser'
  },
  actions: [
    [[['user1', 90], ['user2', 10]], 'checkUser'],
    [['user1', 'user2', 'user3'], 'checkUser'],
    ['user3', ['checkUser', 'checkUser', 'checkUser']],
    ['user4', [['checkUser', 10], ['checkUser', 10], ['checkUser', 10]]],
    [
      [['user1', 90], ['user2', 10]],
      [['checkUser', 10], ['checkUser', 10], ['checkUser', 10]]
    ],
    ['user6', 'checkUser'],
    ['user7', 'checkUser'],
    ['user8', 'checkUser'],
    ['user9', 'checkUser'],
    ['user10', 'checkUser']
  ],
  mode: 'random'
};
