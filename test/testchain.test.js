import { createRemoteClient, createLocalClient } from '../src/testchain';
import createMaker from '../src/maker';

beforeAll(() => {
  jest.setTimeout(8000);
});

test('createRemoteClient returns a connected remote testchain client', async () => {
  const client = await createRemoteClient();
  const networks = await client.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});

test('createLocalClient connects to Staxx in CircleCI', async () => {
  const client = await createLocalClient();
  let error;
  try {
    await client.api.listAllChains();
  } catch (err) {
    error = err;
  }
  expect(error).not.toBeDefined();
});

xtest('createMaker returns a connected maker instance', async () => {
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
