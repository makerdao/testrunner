import createClient, { setTestchainDetails } from '../src/testchain';
import createMaker from '../src/maker';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(() => {
  jest.setTimeout(15000);
});

test('createClient returns a connected testchain client', async () => {
  const client = await createClient();
  await sleep(10000);
  await setTestchainDetails(client.id);
  const networks = await client.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});

test('createMaker returns a connected maker instance', async () => {
  const maker = await createMaker();
  expect(maker).toBeDefined();

  // random data to verify the service is working
  const cdpTypeService = maker.service('mcd:cdpType');
  const [eth, , , zrx] = cdpTypeService.cdpTypes;
  const ethData = await eth._prefetchPromise;
  const zrxData = await zrx._prefetchPromise;
  console.log('ETH', ethData);
  console.log('ZRX', zrxData);
});
