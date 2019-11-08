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
      [
        ['user3', 10],
        ['user3', 10],
        ['user4', 50],
        ['user5', 20],
        ['user6', 1],
        ['user7', 55],
        ['user8', 72],
        ['user9', 45]
      ],
      'checkUser'
    ],
    ['user10', 'checkUser']
  ],
  mode: 'random'
};
