export default {
  precondition: async () => {
    return new Promise(resolve => {
      resolve(true);
    });
  },
  before: async () => {
    return new Promise(resolve => {
      resolve(true);
    });
  },
  operation: async () => {
    return new Promise(resolve => {
      resolve(true);
    });
  },
  after: async () => {
    return new Promise(resolve => {
      resolve(true);
    });
  },
  category: 'selfTest'
};
