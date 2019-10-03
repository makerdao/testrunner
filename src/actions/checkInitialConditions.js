export default {
  operation: async (actor, maker) => {
    return await maker.service('mcd:systemData').getSystemWideDebtCeiling();
  },
  category: 'systemData'
};
