export default {
  operation: async (actor, maker) => {
    console.log(maker.service('web3').currentAddress());
    return await maker.service('mcd:systemData').getSystemWideDebtCeiling();
  },
  category: 'systemData'
};
