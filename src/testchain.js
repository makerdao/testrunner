import { Client, Event } from '@makerdao/testchain-client';
import { asyncForEach, sleep } from '../test/helpers/utils';

// We should make caching optional
let cachedInstance;

// const backendEnv = 'dev';
// const defaultSnapshotId = '17833036062267713253';
// const testchainUrl = process.env.TESTCHAIN_URL || 'http://localhost:4000';
// const websocketUrl = process.env.websocketUrl || 'ws://127.1:4000/socket';

const backendEnv = 'prod';
const defaultSnapshotId = '13978968591367274503';
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
  // We should probably accept an object of
  // options here with the below as defaults

  if (cachedInstance) return cachedInstance;

  const client = new Client(testchainUrl, websocketUrl);

  global.client = client;

  await global.client.init();

  cachedInstance = client;
  return global.client;
};

export const createTestchain = async () => {
  global.client.create(testchainConfig);

  const {
    payload: {
      response: { id }
    }
  } = await global.client.once('api', Event.OK);

  global.testchainId = id;
  return global.testchainId;
};

export const setTestchainDetails = async () => {
  const {
    details: {
      chain_details: { rpc_url }
    }
  } = await global.client.api.getChain(global.testchainId);

  global.backendEnv = backendEnv;
  global.defaultSnapshotId = defaultSnapshotId;
  global.testchainPort = rpc_url.substr(rpc_url.length - 4);
  // global.testchainId = id;
  global.rpcUrl = rpc_url.includes('.local')
    ? `http://localhost:${global.testchainPort}`
    : rpc_url;
};

// Chains need to be stopped first, then deleted
export const removeConnectedChain = async () => {
  console.log('chain to delete', global.testchainId);
  await global.client.stop(global.testchainId);
  await sleep(10000);
  await global.client.api.deleteChain(global.testchainId);
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
