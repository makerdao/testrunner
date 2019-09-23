import createClient from '../src/testchain';

test('createClient returns a connected testchain client', async () => {
  const client = createClient();
  const networks = await client.api.listAllChains();
  expect(networks.data[0].id).toBeDefined();
});
