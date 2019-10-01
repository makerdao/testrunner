import Maker from '@makerdao/dai';
import daiPlugin from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';

const backendEnv = 'dev';
// const backendEnv = 'prod'

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
  //only 2 remaining accounts, so got rid of 'ava'
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

export default async () => {
  // const client = await createClient();

  console.log('id', global.client.id);

  const { details: chainData } = await global.client.api.getChain(
    global.client.id
  );

  const accounts = getAccounts(chainData);

  const config = {
    plugins: [
      [daiPlugin, { prefetch: true }],
      // since the Client is created with prod URL, backendEnv should be prod here:
      [configPlugin, { testchainId: global.client.id, backendEnv: backendEnv }]
    ],
    log: true,
    url: chainData.chain_details.rpc_url,
    network: 'ganache',
    privateKey: accounts.owner.privateKey,
    accounts
    // deploy_step: 1
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
