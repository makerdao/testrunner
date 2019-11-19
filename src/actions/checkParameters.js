export default {
  before: (_, { config }) => {
    config.params1++;
  },
  operation: (_, { config }) => {
    return config;
  },
  category: 'selfTest'
};
