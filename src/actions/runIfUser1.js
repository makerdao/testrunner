export default {
  precondition: user => {
    return user.name === 'user1';
  },
  operation: async user => {
    return user.privateKey;
  },
  category: 'selfTest'
};
