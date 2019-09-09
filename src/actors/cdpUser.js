export default {
  privateKey: name => {
    return {
      user1: '0xa',
      user2: '0xb'
    }[name];
  }
};
