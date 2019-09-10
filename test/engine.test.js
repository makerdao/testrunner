import Engine from '../src/engine';

test('engine can run a simple plan (plans)', async () => {
  const engine = new Engine();
  const report = await engine.run({
    plans: ['self-test']
  });
  expect(report).toEqual({
    success: true,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});

test('engine can run a simple plan (actors, actions)', async () => {
  const engine = new Engine();
  const report = await engine.run({
    actors: { user1: 'cdpUser' },
    actions: [['user1', 'checkUser']]
  });
  expect(report).toEqual({
    success: true,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});

test('fail before', async () => {
  const engine = new Engine();
  const report = await engine.run({
    actors: { user1: 'cdpUser' },
    actions: [
      ['user1', 'checkUser'],
      ['user1', 'failBefore'],
      ['user1', 'checkUser']
    ]
  });
  expect(report).toEqual({
    success: false,
    error: expect.any(Error),
    errorIndex: 1,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});

test('fail after', async () => {
  const engine = new Engine();
  const report = await engine.run({
    actors: { user1: 'cdpUser' },
    actions: [
      ['user1', 'checkUser'],
      ['user1', 'failAfter'],
      ['user1', 'checkUser']
    ]
  });
  expect(report).toEqual({
    success: false,
    error: expect.any(Error),
    errorIndex: 1,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});
