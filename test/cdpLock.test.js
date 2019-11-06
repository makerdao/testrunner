import Engine from '../src/engine';

test('cdp lock', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'openCdp'], ['user1', 'cdpLock']],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  const cdp = report.results[0];
  cdp.reset();
  await cdp.prefetch();

  expect(report.success).toBeTruthy();
  expect(cdp.collateralValue.toNumber()).toBeGreaterThanOrEqual(50);
});
