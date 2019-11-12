import createClient, {
  createTestchain,
  setTestchainDetails
} from '../src/testchain';
import createMaker from '../src/maker';
import { sleep } from './helpers/utils';

let testchainClient;
let testchainId;
let testchainDetails;

beforeAll(async () => {
  jest.setTimeout(30000);
  testchainClient = await createClient();
});

afterAll(async done => {
  const id = testchainId;
  await testchainClient.stop(id);
  await testchainClient.delete(testchainId);
  done();
});

test('createTestchain returns a connected testchain', async () => {
  testchainId = await createTestchain(testchainClient);
  await sleep(15000);
  testchainDetails = await setTestchainDetails(testchainClient, testchainId);
  const networks = await testchainClient.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});

test('createMaker returns a connected maker instance with accounts', async () => {
  const maker = await createMaker(
    testchainClient,
    testchainId,
    testchainDetails
  );
  expect(maker).toBeDefined();

  const accounts = maker.service('accounts').listAccounts();

  expect(accounts.length).toBe(3);
});
