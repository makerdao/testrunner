import Maker from '@makerdao/dai';
import daiPlugin from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';

// const backendEnv = 'dev';
const backendEnv = 'prod';

function getAccounts(chainData) {
  // I just pulled this stuff out of createMaker so it
  // will be easier to figure out what's going on

  const deployedAccounts = chainData.chain_details.accounts;
  const coinbaseAccount = deployedAccounts.find(
    account => account.address === chainData.chain_details.coinbase
  );
  const otherAccounts = deployedAccounts.filter(
    account => account !== coinbaseAccount
  );

  const accounts = ['ali', 'sam'].reduce((result, name, i) => {
    result[name] = {
      type: 'privateKey',
      key: otherAccounts[i].priv_key
    };
    return result;
  }, {});
  accounts.owner = { type: 'privateKey', key: coinbaseAccount.priv_key };

  return accounts;
}

export default async (client, testchainId, options) => {
  // const client = await createClient();
  const { details: chainData } = await client.api.getChain(testchainId);

  const accounts = getAccounts(chainData);

  const config = {
    plugins: [
      [daiPlugin, { prefetch: true }],
      // since the Client is created with prod URL, backendEnv should be prod here:
      [configPlugin, { testchainId: testchainId, backendEnv: backendEnv }]
    ],
    log: true,
    url: options.rpcUrl,
    accounts
  };
  let maker;

  try {
    // ilks(bytes32) and balanceOf(address) fail
    // for multiple contracts here when MCD plugin
    // is included; I think we need to use different
    // contract addresses for the different testchain
    maker = await Maker.create('http', config);
    await maker.authenticate();
  } catch (err) {
    console.error(err);
  }
  return maker;
};
