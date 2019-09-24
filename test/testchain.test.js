import createClient from '../src/testchain';
import createMaker from '../src/maker'

test('createClient returns a connected testchain client', async () => {
  const client = createClient();
  const networks = await client.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});

test('createMaker returns a connected maker instance', async () => {
  jest.setTimeout(15000)
  const maker = await createMaker();
  console.log(maker)
})
