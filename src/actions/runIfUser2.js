export default {
  precondition: user => {
    return user.name === 'user2';
  },
  operation: async user => {
    return user.privateKey;
  },
  category: 'selfTest'
};
