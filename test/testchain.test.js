import createClient, {
  createTestchain,
  setTestchainDetails
} from '../src/testchain';
import createMaker from '../src/maker';
import { sleep } from './helpers/utils';

beforeAll(async () => {
  jest.setTimeout(60000);
  await createClient();
});

afterAll(async done => {
  const id = global.testchainId;
  await global.client.stop(id);
  await global.client.delete(global.testchainId);
  done();
});

test('createTestchain returns a connected testchain', async () => {
  await createTestchain();
  await sleep(15000);
  await setTestchainDetails();
  const networks = await global.client.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});

test('createMaker returns a connected maker instance with accounts', async () => {
  const maker = await createMaker();
  expect(maker).toBeDefined();

  const accounts = maker.service('accounts').listAccounts();
  // console.log('accounts', accounts);
  // Four accounts added via testchainConfig including "owner"/coinbase
  expect(accounts.length).toBe(3);
});

// Helper function if clean up fails in the afterAll block
xtest('delete chain', async () => {
  const id = '7928313069884210829';
  await global.client.stop(id);
  await sleep(15000);
  await global.client.api.deleteChain(id);
});
