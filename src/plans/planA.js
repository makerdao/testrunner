export default {
  before: () => {},
  after: () => {},
  actors: {
    user1: 'cdpUser',
    user2: 'cdpUser'
  },
  actions: [['user1', 'openCdp'], ['user2', 'openCdp'], ['user1', 'drawDai']],
  mode: 'deterministic'
};
