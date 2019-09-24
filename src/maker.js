import Maker from '@makerdao/dai'
import daiPlugin from '@makerdao/dai-plugin-mcd'
import configPlugin from '@makerdao/dai-plugin-config'
import createClient from './testchain'

const fetchAccounts = async () => {
  const client = global.client;
  const { details: chainData } = await client.api.getChain(global.testchainId);
  const deployedAccounts = chainData.chain_details.accounts;

  // Find the coinbase account and put it aside
  const coinbaseAccount = deployedAccounts.find(
    account => account.address === chainData.chain_details.coinbase
  );
  const otherAccounts = deployedAccounts.filter(
    account => account !== coinbaseAccount
  );

  // Set some account names for easy reference
  const accounts = ['ali', 'sam', 'ava'].reduce((result, name, i) => {
    result[name] = {
      type: 'privateKey',
      key: otherAccounts[i].priv_key
    };
    return result;
  }, {});

  // Add the coinbase account back to the accounts
  accounts.owner = { type: 'privateKey', key: coinbaseAccount.priv_key };

  return accounts;
};

export default async function createMaker() {
  const client = createClient()

  const networks = await client.api.listAllChains();
  const id = networks.data[0].id

  const { details: chainData } = await client.api.getChain(id);
  const deployedAccounts = chainData.chain_details.accounts

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

  const config = {
    plugins: [
      [daiPlugin],
      [
        [configPlugin, { testchainId: id, backendEnv: 'dev', }]
      ]
    ],
    log: false,
    url: client.api._url,
    accounts: accounts
  }
  const maker = await Maker.create('http', config)
  await maker.authenticate()
  return maker

}
