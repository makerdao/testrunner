import Engine from '../src/engine';

test('cdp bite', async () => {
  jest.setTimeout(60000);
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'drip'],
      ['user1', 'cdpDrawMax'],
      ['user1', 'sleep10s'],
      ['user1', 'drip'],
      ['user1', 'cdpBite']
    ],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  const cdp = report.results[1];
  cdp.reset();
  await cdp.prefetch();

  expect(report.success).toBeTruthy();
});
