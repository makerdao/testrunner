import Engine from '../src/engine';
import { ETH } from '@makerdao/dai-plugin-mcd';

test('basic cdp functions', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'openCdp']],
    url: 'http://localhost:2000'
  });

  const report = await engine.run();
  expect(report.error).toBeFalsy();
  const cdp = report.results[0];
  expect(cdp.collateralValue.toNumber()).toEqual(150);
  expect(cdp.debtValue.toNumber()).toEqual(20);
});

test('open cdp with parameters', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      [
        'user1',
        [
          [
            'openCdp',
            undefined,
            { ilk: 'ETH-A', collateral: ETH(0.5), dai: 20 }
          ]
        ]
      ]
    ],
    url: 'http://localhost:2000'
  });

  const report = await engine.run();
  expect(report.error).toBeFalsy();
  const cdp = report.results[0];
  expect(cdp.collateralValue.toNumber()).toEqual(75);
  expect(cdp.debtValue.toNumber()).toEqual(20);
});
