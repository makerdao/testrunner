export default {
  operation: async (user, name) => {
    return user.privateKey(name);
  },
  category: 'self-test'
};
