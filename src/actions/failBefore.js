export default {
  before: () => {
    throw new Error('failure in before');
  },
  operation: async user => {
    return user.privateKey;
  },
  category: 'selfTest'
};
