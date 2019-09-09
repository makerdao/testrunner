export default {
  after: () => {
    throw new Error('failure in after');
  },
  operation: async user => {
    return user.privateKey;
  },
  category: 'self-test'
};
