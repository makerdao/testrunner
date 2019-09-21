import { Client } from '@makerdao/testchain-client';

let cachedInstance;
// We should make caching optional

export default function createClient() {
  // We should probably accept an object of
  // options here with the below as defaults

  if (cachedInstance) return cachedInstance;

  const client = new Client(
    'https://testchain-backendgatway.makerfoundation.com:4001'
  );
  client.init();
  client.create({
    clean_on_stop: false,
    chainType: 'ganache',
    block_mine_time: 0,
    accounts: 3
  });
  cachedInstance = client;
  console.log('supp');
  return client;
}
