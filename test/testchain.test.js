import createClient, {
  createTestchain,
  setTestchainDetails
} from '../src/testchain';
import createMaker from '../src/maker';
import { stopAllChains, deleteAllChains } from './helpers/utils';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  jest.setTimeout(30000);
  await createClient();
});

// afterAll(async done => {
//   await global.client.delete(global.testchainId);
//   await sleep(15000);
//   done();
// });

test('createTestchain returns a connected testchain', async () => {
  await createTestchain();
  await sleep(15000);
  console.log('global ID', global.testchainId);
  await setTestchainDetails();
  const networks = await global.client.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});

test('createMaker returns a connected maker instance with accounts', async () => {
  const maker = await createMaker();
  expect(maker).toBeDefined();

  const accounts = maker.service('accounts').listAccounts();
  console.log('accounts', accounts);
  // Four accounts added via testchainConfig including "owner"/coinbase
  expect(accounts.length).toBe(4);
});

// test('delete chains', async () => {
//   const { data: chains } = await global.client.api.listAllChains();
//   console.log('CHAINS', chains);
//   // await stopAllChains(chains, global.client);
//   await deleteAllChains(chains, global.client);
// });
