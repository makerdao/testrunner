import Engine from '../src/engine';
import { BAT } from '@makerdao/dai-plugin-mcd';

test('cdp open and bite', async () => {
  jest.setTimeout(60000);
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'cdpOpenAndBite']],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  expect(report.success).toBeTruthy();
});

test('cdp open and make unsafe', async () => {
  jest.setTimeout(60000);
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'cdpOpenUnsafe']],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  expect(report.success).toBeTruthy();
});

test('Run cdp action only if there is enough collateral in account', async () => {
  jest.setTimeout(20000);
  const engine = new Engine({
    actors: {
      user1: 'testAccounts',
      user2: 'testAccounts',
      user3: 'testAccounts',
      user4: 'selfTestUser',
      user5: 'selfTestUser'
    },
    actions: [
      [
        ['user4', 'user5'],
        [['cdpOpenAndBite', { collateral: BAT(1001), ilk: 'BAT-A' }]]
      ]
    ],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  expect(report.success).toBeTruthy();
  expect(report.completed.length).toBe(1);
});
