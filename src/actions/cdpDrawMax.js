import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
export default {
  before: () => {},
  operation: async (user, { maker }) => {
    const manager = maker.service('mcd:cdpManager');
    const proxy = await maker.service('proxy').getProxyAddress();
    const cdpIds = await maker.service('mcd:cdpManager').getCdpIds(proxy, true);

    let cdp = await manager.getCdp(cdpIds[0].id, { cache: false });
    cdp.reset();
    await cdp.prefetch();
    let amount = cdp.isSafe ? cdp.daiAvailable._amount - 0.00001 : 0;
    amount = amount < 0 ? 0 : amount;

    await maker
      .service('mcd:cdpManager')
      .lockAndDraw(cdp.id, cdp.ilk, ETH(0), MDAI(amount));

    await cdp.prefetch();
    return cdp;
  },
  after: () => {},
  category: 'cdp'
};
