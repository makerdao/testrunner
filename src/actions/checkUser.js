export default {
  operation: async user => {
    return user.privateKey;
  },
  category: 'self-test'
};
