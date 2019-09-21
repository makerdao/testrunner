import createClient from '../src/testchain';

test('createClient returns a connected testchain client', async () => {
  const client = createClient();
  expect(client).toBeDefined();
  const networks = await client.api.listAllChains();
  expect(networks.data[0].id).toEqual('14505111095087240710');
});
