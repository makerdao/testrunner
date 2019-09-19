import { Client } from '@makerdao/testchain-client';

const client = new Client(
  'https://testchain-backendgatway.makerfoundation.com:4001'
);

beforeAll(async () => {
  await client.init();
  await client.create({
    clean_on_stop: false,
    chainType: 'ganache',
    block_mine_time: 0,
    accounts: 3
  });
  console.log(await client.api.listAllChains());
});

test('basic setup', async () => {
  expect(1 + 1).toEqual(2);
});
