export default {
  before: () => {},
  after: () => {},
  actors: {
    user1: 'selfTestUser',
    user2: 'selfTestUser'
  },
  actions: [['user1', 'openCdp'], ['user2', 'openCdp'], ['user1', 'drawDai']],
  mode: 'deterministic'
};
