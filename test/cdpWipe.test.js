import Engine from '../src/engine';

test('cdp wipe and free', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'cdpLock'],
      ['user1', 'cdpDraw'],
      ['user1', 'cdpWipe'],
      ['user1', 'cdpFree']
    ],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();
  console.log(report);
  expect(report.success).toBeTruthy();
});
