export default {
  operation: async (actor, { maker }) => {
    const systemDataService = maker.service('mcd:systemData');
    const debtCeiling = await systemDataService.getSystemWideDebtCeiling();
    const baseRate = await systemDataService.getAnnualBaseRate();
    return {
      debtCeiling,
      baseRate
    };
  },
  category: 'systemData'
};
