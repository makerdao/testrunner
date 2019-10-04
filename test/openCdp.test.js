import Engine from '../src/engine';

test('basic cdp functions', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'openCdp']],
    url: 'http://localhost:2000'
  });

  const report = await engine.run();
  const cdp = report.results[0];
  expect(cdp.collateralValue.toNumber()).toEqual(150);
  expect(cdp.debtValue.toNumber()).toEqual(1);
});
