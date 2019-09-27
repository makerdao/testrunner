import Maker from '@makerdao/dai';
import daiPlugin from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';
import { createRemoteClient } from './testchain';
// import { Event } from '@makerdao/testchain-client';

export default async function createMaker() {
  const client = await createRemoteClient();
  // const networks = await client.api.listAllChains();
  // const id = networks.data[0].id;

  // This appears to be the only existing chain on prod with contracts deployed:
  const id = '13509017273128723302';

  const chains = await client.api.listAllChains();
  console.log(chains);
  // const { OK } = Event;
  // const {
  //   payload: {
  //     response: { id }
  //   }
  // } = await client.once('api', OK);
  // const chainData = chains.data[0];
  // console.log(chains.data);
  // for (const chain in chains.data) {
  //   console.log(chains.data[chain]);
  //   // client.stop(chains.data[chain].id)
  // }

  const { details: chainData } = await client.api.getChain(id);
  const accounts = getAccounts(chainData);

  const config = {
    plugins: [
      [daiPlugin, { prefetch: true }],
      // since the Client is created with prod URL, backendEnv should be prod here:
      [configPlugin, { testchainId: id, backendEnv: 'prod' }]
    ],
    log: false,
    url: chainData.chain_details.rpc_url,
    network: 'ganache',
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
