import Engine from '../src/engine';

test('engine can run a simple plan', async () => {
  const engine = new Engine();
  const report = await engine.run({
    plans: ['selfTestA']
  });

  expect(report).toEqual({
    success: true,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});

test('engine can run multiple simple plans', async () => {
  const engine = new Engine();
  const report = await engine.run({
    plans: ['selfTestA', 'selfTestB']
  });

  expect(report).toEqual({
    results: ['0xa', '0xa', '0xb'],
    success: true,
    completed: [
      ['user1', 'checkUser'],
      ['user1', 'checkUser'],
      ['user2', 'checkUser']
    ]
  });
});

test('engine can run an explicit series of actors and actions', async () => {
  const engine = new Engine();
  const report = await engine.run({
    actors: { user1: 'selfTestUser' },
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
    actors: { user1: 'selfTestUser' },
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
    actors: { user1: 'selfTestUser' },
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
