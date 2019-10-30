export default {
  operation: async (user, { maker }) => {
    return maker
      .service('token')
      .getToken('ETH')
      .balance();
  }
};
