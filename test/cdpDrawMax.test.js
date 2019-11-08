import Engine from '../src/engine';

test('cdp draw max', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'openCdp'],
      ['user1', 'cdpLock'],
      ['user1', 'drip'],
      ['user1', 'cdpDrawMax']
    ],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  const cdp = report.results[0];
  cdp.reset();
  await cdp.prefetch();

  expect(report.success).toBeTruthy();
  expect(!cdp.isSafe || cdp.daiAvailable._amount < 0.01).toBeTruthy();
});
