// these tests require makerdao/testchain to be running with a default snapshot
// and assume the test users have not transferred any ETH

import Engine from '../src/engine';
import { ETH } from '@makerdao/dai';

let origEthFrom;
beforeAll(() => {
  origEthFrom = process.env.ETH_FROM;
  process.env.ETH_FROM = '';
});

afterAll(() => {
  process.env.ETH_FROM = origEthFrom;
});

test('use the first account', async () => {
  const engine = new Engine({
    plans: ['selfTestChain'],
    url: 'http://localhost:2000',
    rpcAccounts: true
  });
  const report = await engine.run();
  if (report.error) console.error(report.error);
  expect(report).toEqual({
    results: ['0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6', expect.anything()],
    success: true,
    completed: [['user1', 'showAddress'], ['user1', 'checkEthBalance']]
  });
});

test('use a specific account', async () => {
  const engine = new Engine({
    plans: ['selfTestTwoUsers'],
    url: 'http://localhost:2000',
    rpcAccounts: true,
    address: 'b054303ff27afd3b1a600f86215c5128a83c38e9'
  });

  const report = await engine.run();
  if (report.error) console.error(report.error);
  expect(report).toEqual({
    results: [
      '0xb054303ff27afd3b1a600f86215c5128a83c38e9',
      ETH(100),
      '0x75be2d1186d2806b61f1ac984475979eeed18702',
      ETH(100),
      '0xb054303ff27afd3b1a600f86215c5128a83c38e9',
      ETH(100),
      '0x75be2d1186d2806b61f1ac984475979eeed18702',
      ETH(100)
    ],
    success: true,
    completed: [
      ['user1', 'showAddress'],
      ['user1', 'checkEthBalance'],
      ['user2', 'showAddress'],
      ['user2', 'checkEthBalance'],
      ['user1', 'showAddress'],
      ['user1', 'checkEthBalance'],
      ['user2', 'showAddress'],
      ['user2', 'checkEthBalance']
    ]
  });
}, 10000);
