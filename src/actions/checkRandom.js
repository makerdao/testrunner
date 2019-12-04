export default {
  before: (_, { config, rng }) => {
    config.value = rng.randomWeightedIndex(Array(100).fill(1));
    return true;
  },
  operation: (_, { config }) => {
    return config.value;
  },
  category: 'selfTest'
};
