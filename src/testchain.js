import { Client, Event } from '@makerdao/testchain-client';
import { asyncForEach, sleep } from '../test/helpers/utils';

// const backendEnv = 'dev';
// const defaultSnapshotId = '17833036062267713253';
// const testchainUrl = process.env.TESTCHAIN_URL || 'http://localhost:4000';
// const websocketUrl = process.env.websocketUrl || 'ws://127.1:4000/socket';

const backendEnv = 'prod';
const defaultSnapshotId = '12911430008968214647';
const testchainUrl = 'http://18.185.172.121:4000';
const websocketUrl = 'ws://18.185.172.121:4000/socket';

const testchainConfig = {
  accounts: 3,
  block_mine_time: 0,
  clean_on_stop: true,
  description: 'DaiPluginDefaultremote1',
  type: 'geth', // the restart testchain process doesn't work well with ganache
  snapshot_id: defaultSnapshotId
};

export default async () => {
  const client = new Client(testchainUrl, websocketUrl);
  await client.init();
  return client;
};

export const createTestchain = async client => {
  // We should probably accept an object of
  // options here with the below as defaults
  client.create(testchainConfig);

  const {
    payload: {
      response: { id }
    }
  } = await client.once('api', Event.OK);

  return id;
};

export const setTestchainDetails = async (client, testchainId) => {
  const {
    details: {
      chain_details: { rpc_url }
    }
  } = await client.api.getChain(testchainId);

  return {
    backendEnv,
    defaultSnapshotId,
    testchainPort: rpc_url.substr(rpc_url.length - 4),
    rpcUrl: rpc_url.includes('.local')
      ? `http://localhost:${global.testchainPort}`
      : rpc_url
  };
};

// Chains need to be stopped first, then deleted
export const removeConnectedChain = async (client, testchainId) => {
  console.log('chain to delete', testchainId);
  await client.stop(testchainId);
  await sleep(10000);
  await client.api.deleteChain(testchainId);
  await sleep(10000);
};

export const stopAllChains = async (chains, client) => {
  await asyncForEach(chains, async chain => {
    await client.stop(chain.id);
  });
};

export const deleteAllChains = async (chains, client) => {
  await asyncForEach(chains, async chain => {
    await client.api.deleteChain(chain.id);
  });
};
