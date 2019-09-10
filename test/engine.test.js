import Engine from '../src/engine';

test.only('engine can run a simple plan', async () => {
  const engine = new Engine();
  const report = await engine.run({
    plan: 'self-test'
  });
  expect(report).toEqual({
    success: true,
    results: ['0xa']
  });
});

test('engine can run a simple plan', async () => {
  const engine = new Engine();
  const report = await engine.run({
    actors: { user1: 'cdpUser' },
    actions: [['user1', 'checkUser']]
  });
  expect(report).toEqual({
    success: true,
    results: ['0xa']
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
    results: ['0xa']
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
    results: ['0xa']
  });
});
