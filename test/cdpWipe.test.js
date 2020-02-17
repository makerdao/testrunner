import Engine from '../src/engine';

test('cdp wipe and free', async () => {
  jest.setTimeout(20000);
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'openCdp'],
      ['user1', 'cdpLock'],
      ['user1', 'cdpDraw'],
      ['user1', 'cdpWipe'],
      ['user1', 'cdpFree']
    ],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  expect(report.success).toBeTruthy();
});
