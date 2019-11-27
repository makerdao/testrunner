import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
import { stringToBytes } from '../helpers/utils';

export default {
  before: (_, { config }) => {
    config.ilk = config && config.ilk ? config.ilk : 'ETH-A';
    config.collateral =
      config && config.collateral ? config.collateral : ETH(4);
    return true;
  },
  operation: async (user, { maker, config }) => {
    const manager = maker.service('mcd:cdpManager');
    const managerAddress = manager
      .get('smartContract')
      .getContractAddress('CDP_MANAGER');

    //open CDP
    const cdp = await maker
      .service('mcd:cdpManager')
      .openLockAndDraw(config.ilk, config.collateral, MDAI(20));
    cdp.reset();
    cdp.type.reset();
    await cdp.prefetch();

    //draw maximum amount of collateral using frob directly (skipping drip())
    const ilkInfo = await cdp.type.ilkInfo();
    const amount = cdp.isSafe
      ? cdp.daiAvailable.shiftedBy(27).div(ilkInfo.rate)
      : MDAI(0);

    await manager.proxyActions.frob(
      managerAddress,
      cdp.id,
      ETH(0).toFixed('wei'),
      amount.toFixed('wei'),
      { dsProxy: true, value: 0 }
    );

    //drip
    await maker
      .service('smartContract')
      .getContract('MCD_JUG')
      .drip(stringToBytes('ETH-A'));

    //bite
    const urn = await cdp.getUrn();
    await maker.service('mcd:systemData').cat.bite(stringToBytes(cdp.ilk), urn);

    return {
      message: 'cdp bitten',
      cpd_id: cdp.id,
      cdp_ilk: cdp.ilk,
      cdp_urn: urn
    };
  },
  after: () => {},
  category: 'cdp'
};
