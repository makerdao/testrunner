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
    ['user1', 'checkUser'],
    ['user2', 'checkUser'],
    [
      ['user3', 'checkUser', 10],
      ['user4', 'checkUser', 50],
      ['user5', 'checkUser', 20],
      ['user6', 'checkUser', 1],
      ['user7', 'checkUser', 55],
      ['user8', 'checkUser', 72],
      ['user9', 'checkUser', 45]
    ],
    ['user10', 'checkUser']
  ],
  mode: 'random'
};
