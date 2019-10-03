import Maker from '@makerdao/dai';
import daiPlugin from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';

// const backendEnv = 'dev';
const backendEnv = 'prod';

function getAccounts(chainData) {
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
  const { details: chainData } = await client.api.getChain(testchainId);

  const accounts = getAccounts(chainData);

  const config = {
    plugins: [
      [daiPlugin, { prefetch: true }],
      [configPlugin, { testchainId: testchainId, backendEnv: backendEnv }]
    ],
    log: false,
    url: options.rpcUrl,
    accounts
  };

  const maker = await Maker.create('http', config);
  await maker.authenticate();
  return maker;
};
