import RandomWeights from 'random-seed-weighted-chooser';

export default {
  before: (_, { config, seed }) => {
    config.value = RandomWeights.chooseWeightedIndex(Array(100).fill(1), seed);
    return true;
  },
  operation: (_, { config }) => {
    return config.value;
  },
  category: 'selfTest'
};
