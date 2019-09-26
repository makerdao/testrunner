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

test('when engine fails before, it stops immediately and updates report with error info', async () => {
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
  expect(report.error.message).toEqual('failure in before');
});

test('when engine fails during operation, it stops immediately and updates report with error info', async () => {
  const engine = new Engine();
  const report = await engine.run({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'checkUser'],
      ['user1', 'failDuring'],
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
  expect(report.error.message).toEqual('failure in operation');
});

test('when engine fails after, it stops immediately and updates report with error info', async () => {
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
  expect(report.error.message).toEqual('failure in after');
});

test('engine can randomize nested actions', async () => {
  const engine = new Engine();
  const actorsAndActions = {
    actors: {
      user1: 'selfTestUser',
      user2: 'selfTestUser',
      user3: 'selfTestUser',
      user4: 'selfTestUser',
      user5: 'selfTestUser',
      user6: 'selfTestUser',
      user7: 'selfTestUser',
      user8: 'selfTestUser',
      user9: 'selfTestUser',
      user10: 'selfTestUser'
    },
    actions: [
      ['user1', 'checkUser'],
      [
        ['user3', 'checkUser'],
        ['user4', 'checkUser'],
        ['user5', 'checkUser'],
        ['user6', 'checkUser'],
        ['user7', 'checkUser'],
        ['user8', 'checkUser'],
        ['user9', 'checkUser'],
        ['user10', 'checkUser']
      ],
      ['user2', 'checkUser']
    ]
  };
  const report1 = await engine.run({ ...actorsAndActions });
  let report2 = await engine.run({ ...actorsAndActions });

  if (report1 === report2) {
    report2 = await engine.run({ ...actorsAndActions });
  }

  expect(report1).not.toEqual(report2);
});

test('engine can randomize nested actions from imported plans', async () => {
  const engine = new Engine();
  const report1 = await engine.run({ plans: ['selfTestC'] });
  let report2 = await engine.run({ plans: ['selfTestC'] });

  if (report1 === report2) {
    report2 = await engine.run({ plans: ['selfTestC'] });
  }

  expect(report1).not.toEqual(report2);
});

test('engine can randomize all actions when plan mode is set to random', async () => {
  const engine = new Engine();
  const report1 = await engine.run({ plans: ['selfTestD'] });
  let report2 = await engine.run({ plans: ['selfTestD'] });

  if (report1 === report2) {
    report2 = await engine.run({ plans: ['selfTestD'] });
  }

  expect(report1).not.toEqual(report2);
});

test('engine throws when given invalid plans, actions, or actors', async () => {
  const invalidParams = [
    {},
    {
      plans: ['selfTestA'],
      actors: { user1: 'selfTestUser' },
      actions: ['user1', 'checkUser']
    },
    { actors: { user1: 'selfTestUser' }, actions: [['user1', 'fakeAction']] },
    { actors: { user1: 'fakeUser' }, actions: [['user1', 'checkUser']] },
    { plans: ['fakePlan'] }
  ];

  for (const params in invalidParams) {
    const errorMessage = await testRunError(params[invalidParams]);
    expect(typeof errorMessage).toEqual('string');
  }
});

async function testRunError(params) {
  const engine = new Engine();
  try {
    return await engine.run(params);
  } catch (err) {
    return err.message;
  }
}
