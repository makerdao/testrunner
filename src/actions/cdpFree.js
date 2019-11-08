export default {
  operation: async (user, { maker }) => {
    const proxy = await maker.service('proxy').getProxyAddress();
    const cdpIds = await maker.service('mcd:cdpManager').getCdpIds(proxy, true);
    const cdp = await maker.service('mcd:cdpManager').getCdp(cdpIds[0].id);

    await cdp.freeCollateral(1);

    return cdp;
  },
  after: () => {},
  category: 'cdp'
};
