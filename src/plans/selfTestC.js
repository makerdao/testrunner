export default {
  actors: {
    user1: 'selfTestUser',
    user2: 'selfTestUser',
    user3: 'selfTestUser',
    user4: 'selfTestUser',
    user5: 'selfTestUser'
  },
  actions: [
    ['user1', 'checkUser'],
    [['user3', 'checkUser'], ['user4', 'checkUser'], ['user5', 'checkUser']],
    ['user2', 'checkUser']
  ]
};
