import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';

export default {
  operation: async (user, { maker }) => {
    const proxy = await maker.service('proxy').getProxyAddress();
    const cdpIds = await maker.service('mcd:cdpManager').getCdpIds(proxy, true);
    const cdp = await maker.service('mcd:cdpManager').getCdp(cdpIds[0].id);

    await maker
      .service('mcd:cdpManager')
      .lockAndDraw(cdp.id, cdp.ilk, ETH(0), MDAI(50));

    return cdp;
  },
  after: () => {},
  category: 'cdp'
};
