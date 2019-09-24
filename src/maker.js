import Maker from '@makerdao/dai';
import daiPlugin from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';
import createClient from './testchain';

export default async function createMaker() {
  const client = createClient();
  const networks = await client.api.listAllChains();
  const id = networks.data[0].id;
  const { details: chainData } = await client.api.getChain(id);
  const accounts = getAccounts(chainData);

  const config = {
    plugins: [
      // [daiPlugin, { network: 'testnet', prefetch: true }],
      [[configPlugin, { testchainId: id, backendEnv: 'dev' }]]
    ],
    log: false,
    url: chainData.chain_details.rpc_url,
    network: 'testnet',
    privateKey: accounts.owner.privateKey,
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
}

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
  const accounts = ['ali', 'sam', 'ava'].reduce((result, name, i) => {
    result[name] = {
      type: 'privateKey',
      key: otherAccounts[i].priv_key
    };
    return result;
  }, {});
  accounts.owner = { type: 'privateKey', key: coinbaseAccount.priv_key };

  return accounts;
}
