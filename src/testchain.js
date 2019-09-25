import { Client } from '@makerdao/testchain-client';
// import Maker from '@makerdao/dai'
// import configPlugin from '@makerdao/dai-plugin-config'

// let cachedInstance;
// We should make caching optional

export default async function createClient() {
  // We should probably accept an object of
  // options here with the below as defaults

  // if (cachedInstance) return cachedInstance;

  const client = await new Client(
    // 'http://localhost:4000',
    // 'ws://localhost:4000/socket'
    'https://testchain-backendgatway.makerfoundation.com:4001'
  );
  await client.init();

  /*
  client.create doesn't appear to be working here, so no testchain is created.
  hard to debug on prod, but if you run the testchain_backend locally
  it should log the error
  */
  await client.create({
    clean_on_stop: false,
    chainType: 'ganache',
    block_mine_time: 0,
    accounts: 3
  });
  // cachedInstance = client;

  return client;
}
