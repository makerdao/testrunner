export default {
  before: async (actor, maker, currencies) => {
    return await maker
      .service('mcd:cdpManager')
      .open('ETH-A', currencies.ETH(1), 2);
  },
  operation: (actor, maker, currencies) => {
    console.log(maker.service('mcd:systemData'));
    return maker.service('mcd:cdpType').debtCeiling;
    // return maker.service('mcd:cdpType');
  },
  category: 'systemData'
};
