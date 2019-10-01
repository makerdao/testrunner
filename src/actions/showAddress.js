export default {
  operation: async (user, maker) => {
    return maker.currentAddress();
  }
};
