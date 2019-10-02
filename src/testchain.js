import { Client, Event } from '@makerdao/testchain-client';

// We should make caching optional
let cachedInstance;

const backendEnv = 'dev';
const defaultSnapshotId = '8523365564918950365';
const testchainUrl = process.env.TESTCHAIN_URL || 'http://localhost:4000';
const websocketUrl = process.env.websocketUrl || 'ws://127.1:4000/socket';

// const backendEnv = 'prod'
// const defaultSnapshotId = '6925561923190355037'
// const testchainUrl = 'http://18.185.172.121:4000'
// const websocketUrl = 'ws://18.185.172.121:4000/socket'

const testchainConfig = {
  accounts: 3,
  block_mine_time: 0,
  clean_on_stop: true,
  description: 'DaiPluginDefaultremote1',
  type: 'geth', // the restart testchain process doesn't work well with ganache
  snapshot_id: defaultSnapshotId
  // network_id: 1337 // for geth this is required
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
  console.log('ID for testchain', global.testchainId);
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
