import { Client } from '@makerdao/testchain-client';

let cachedInstance;

export default async function client() {
  if (cachedInstance) return cachedInstance;

  const client = new Client(
    'https://testchain-backendgatway.makerfoundation.com:4001'
  );
  client.init();
  await client.create({
    clean_on_stop: false,
    chainType: 'ganache',
    block_mine_time: 0,
    accounts: 3
  });
  cachedInstance = client;
  console.log(await client.api.listAllChains());
  return client;
}
