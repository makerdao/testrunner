import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
export default {
  before: (_, { config }) => {
    config.ilk = config.ilk ? config.ilk : 'ETH-A';
    config.collateral = config.collateral ? config.collateral : ETH(1);
    config.dai = config.dai ? config.dai : 20;
    return true;
  },
  operation: async (user, { maker, config }) => {
    //open CDP
    const cdp = await maker
      .service('mcd:cdpManager')
      .openLockAndDraw(config.ilk, config.collateral, MDAI(config.dai));

    const urn = await cdp.getUrn();

    return {
      message: 'cdp safe',
      cpd_id: cdp.id,
      cdp_ilk: cdp.ilk,
      cdp_urn: urn
    };
  },
  after: () => {},
  category: 'cdp'
};
