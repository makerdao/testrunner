import Engine from '../src/engine';

test('can get basic system data to verify deployment', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'checkInitialConditions']]
  });
  const report = await engine.run();
});
