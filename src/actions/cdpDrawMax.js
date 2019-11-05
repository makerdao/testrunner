import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
export default {
  before: () => {},
  operation: async (user, { maker }) => {
    const manager = maker.service('mcd:cdpManager');
    const managerAddress = manager
      .get('smartContract')
      .getContractAddress('CDP_MANAGER');
    const proxy = await maker.service('proxy').getProxyAddress();
    const cdpIds = await maker.service('mcd:cdpManager').getCdpIds(proxy, true);

    const cdp = await manager.getCdp(cdpIds[0].id);
    cdp.reset();
    cdp.type.reset();
    await cdp.prefetch();

    const ilkInfo = await cdp.type.ilkInfo();
    const amount = cdp.isSafe
      ? cdp.daiAvailable.shiftedBy(27).div(ilkInfo.rate)
      : MDAI(0);

    //Use frob directly to avoid a drip()
    const method = 'frob';
    const args = [
      managerAddress,
      cdp.id,
      ETH(0).toFixed('wei'),
      amount.toFixed('wei'),
      {
        dsProxy: true,
        value: 0
      }
    ].filter(x => x);

    await manager.proxyActions[method](...args);
  },
  after: () => {},
  category: 'cdp'
};
