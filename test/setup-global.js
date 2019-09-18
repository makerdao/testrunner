const { Client, Event } = require('@makerdao/testchain-client');
global.WebSocket = require('ws');

module.exports = async function() {
  const client = new Client(
    'http://localhost:4000'
    // 'https://testchain-backendgatway.makerfoundation.com:4001'
  );
  await client.init();

  console.log('client connected');

  const { OK } = Event;

  const config = {
    accounts: 4,
    block_mine_time: 0,
    clean_on_stop: false,
    network_id: 1337,
    type: 'geth',
    step_id: 4
  };

  client.create(config);

  const {
    payload: {
      response: { id }
    }
  } = await client.once('api', OK);
  console.log(id, 'id');
  const { details: chain } = await client.api.getChain(id);
  console.log(chain, 'chain');
};
