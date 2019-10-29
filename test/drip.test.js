import Engine from '../src/engine';

test('drip', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'drip']],
    url: 'http://localhost:2000'
  });
  const report = await engine.run();

  expect(report.success).toBeTruthy();
});
