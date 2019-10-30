import { stringToBytes } from '../helpers/utils';
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  before: () => {},
  operation: async (user, maker) => {
    const proxy = await maker.service('proxy').getProxyAddress();
    const cdpIds = await maker.service('mcd:cdpManager').getCdpIds(proxy, true);
    const cdp = await maker.service('mcd:cdpManager').getCdp(cdpIds[0].id);
    const urn = await cdp.getUrn();
    await maker.service('mcd:systemData').cat.bite(stringToBytes(cdp.ilk), urn);
    return cdp;
  },
  after: () => {},
  category: 'cdp'
};
