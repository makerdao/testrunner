import Engine from '../src/engine';

test('simple plan', async () => {
  const engine = new Engine({
    plans: ['selfTestA']
  });
  const report = await engine.run();

  expect(report).toEqual({
    success: true,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});

test('multiple simple plans', async () => {
  const engine = new Engine({
    plans: ['selfTestA', 'selfTestB']
  });
  const report = await engine.run();

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

test('explicit series of actors and actions', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'checkUser']]
  });
  const report = await engine.run();

  expect(report).toEqual({
    success: true,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
});

test('fail before', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'checkUser'],
      ['user1', 'failBefore'],
      ['user1', 'checkUser']
    ]
  });
  const report = await engine.run();

  expect(report).toEqual({
    success: false,
    error: expect.any(Error),
    errorIndex: 1,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
  expect(report.error.message).toEqual('failure in before');
});

test('fail during', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'checkUser'],
      ['user1', 'failDuring'],
      ['user1', 'checkUser']
    ]
  });
  const report = await engine.run();

  expect(report).toEqual({
    success: false,
    error: expect.any(Error),
    errorIndex: 1,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
  expect(report.error.message).toEqual('failure in operation');
});

test("each step gets previous step's return value", async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'checkLastResult']]
  });
  const report = await engine.run();
  expect(report).toEqual({
    success: false,
    error: expect.objectContaining({ message: 'value is not 3' }),
    errorIndex: 0,
    results: [],
    completed: []
  });
});

test('fail after', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [
      ['user1', 'checkUser'],
      ['user1', 'failAfter'],
      ['user1', 'checkUser']
    ]
  });
  const report = await engine.run();

  expect(report).toEqual({
    success: false,
    error: expect.any(Error),
    errorIndex: 1,
    results: ['0xa'],
    completed: [['user1', 'checkUser']]
  });
  expect(report.error.message).toEqual('failure in after');
});

test('randomize nested actions', async () => {
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
        [
          ['user3', 'checkUser'],
          ['user4', 'checkUser'],
          ['user5', 'checkUser'],
          ['user6', 'checkUser'],
          ['user7', 'checkUser'],
          ['user8', 'checkUser'],
          ['user9', 'checkUser'],
          ['user10', 'checkUser']
        ]
      ],
      ['user2', 'checkUser']
    ]
  };
  const engine = new Engine({ ...actorsAndActions });
  const report1 = await engine.run();
  let report2 = await engine.run();

  if (report1 === report2) {
    report2 = await engine.run();
  }

  expect(report1).not.toEqual(report2);
});

test('randomize nested actions from imported plans', async () => {
  const engine = new Engine({ plans: ['selfTestC'] });
  const report1 = await engine.run();
  let report2 = await engine.run();

  if (report1 === report2) {
    report2 = await engine.run();
  }

  expect(report1).not.toEqual(report2);
  expect(report1.completed.length).toEqual(10);
});

test('randomize all actions when plan mode is set to random', async () => {
  const engine = new Engine({ plans: ['selfTestD'] });
  const report1 = await engine.run();
  let report2 = await engine.run();

  if (report1 === report2) {
    report2 = await engine.run();
  }

  expect(report1).not.toEqual(report2);
  expect(report1.completed.length).toEqual(10);
});

test('pick a random action in a nested action in random mode', async () => {
  const engine = new Engine({ plans: ['selfTestE'] });
  const report1 = await engine.run();
  let report2 = await engine.run();

  if (report1 === report2) {
    report2 = await engine.run();
  }

  expect(report1).not.toEqual(report2);
  expect(report1.completed.length).toEqual(4);
});

test('pick a random actions and users based on a weight', async () => {
  const engine = new Engine({ plans: ['selfTestF'] });
  const report1 = await engine.run();
  let report2 = await engine.run();

  if (report1 === report2) {
    report2 = await engine.run();
  }

  expect(report1).not.toEqual(report2);
  expect(report1.completed.length).toEqual(10);
});

test('run only tests executable by user', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser', user2: 'selfTestUser' },
    actions: [
      [[['user1', 999], ['user2', 1]], ['runIfUser1', 'runIfUser2']],
      [[['user2', 999], ['user1', 1]], ['runIfUser1', 'runIfUser2']]
    ]
  });
  const report = await engine.run();

  expect(report).toEqual({
    results: ['0xa', '0xb'],
    success: true,
    completed: [['user1', 'runIfUser1'], ['user2', 'runIfUser2']]
  });
});

test('identical random seed yield identical plans', async () => {
  const engine1 = new Engine({
    actors: {
      user1: 'selfTestUser',
      user2: 'selfTestUser',
      user3: 'selfTestUser',
      user4: 'selfTestUser',
      user5: 'selfTestUser'
    },
    actions: [
      [
        ['user1', 'user2', 'user3', 'user4', 'user5'],
        [['checkUser', 10], ['checkUser', 90]]
      ]
    ],
    seed: 1234
  });
  const report1 = await engine1.run();

  const engine2 = new Engine({
    actors: {
      user1: 'selfTestUser',
      user2: 'selfTestUser',
      user3: 'selfTestUser',
      user4: 'selfTestUser',
      user5: 'selfTestUser'
    },
    actions: [
      [
        ['user1', 'user2', 'user3', 'user4', 'user5'],
        [['checkUser', 10], ['checkUser', 90]]
      ]
    ],
    seed: 1234
  });
  const report2 = await engine2.run();

  expect(report1.success).toBeTruthy();
  expect(report1).toEqual(report2);
});

test('different random seed yield different plans', async () => {
  const engine1 = new Engine({
    actors: {
      user1: 'selfTestUser',
      user2: 'selfTestUser',
      user3: 'selfTestUser',
      user4: 'selfTestUser',
      user5: 'selfTestUser'
    },
    actions: [
      [
        ['user1', 'user2', 'user3', 'user4', 'user5'],
        [['checkUser', 10], ['checkUser', 90]]
      ]
    ],
    seed: 5678
  });
  const report1 = await engine1.run();

  const engine2 = new Engine({
    actors: {
      user1: 'selfTestUser',
      user2: 'selfTestUser',
      user3: 'selfTestUser',
      user4: 'selfTestUser',
      user5: 'selfTestUser'
    },
    actions: [
      [
        ['user1', 'user2', 'user3', 'user4', 'user5'],
        [['checkUser', 10], ['checkUser', 90]]
      ]
    ],
    seed: 1234
  });
  const report2 = await engine2.run();

  expect(report1.success).toBeTruthy();
  expect(report2.success).toBeTruthy();
  expect(report1).not.toEqual(report2);
});

test('run two iterations of a random test plan, yielding different results', async () => {
  const engine1 = new Engine({
    actors: {
      user1: 'selfTestUser',
      user2: 'selfTestUser',
      user3: 'selfTestUser',
      user4: 'selfTestUser',
      user5: 'selfTestUser'
    },
    actions: [
      [
        ['user1', 'user2', 'user3', 'user4', 'user5'],
        [['checkUser', 10], ['checkUser', 90]]
      ]
    ],
    seed: 1,
    iterations: 2,
    sleepduration: 1
  });
  const report = await engine1.run();

  expect(report.success).toBeTruthy();
  expect(report.completed.length).toEqual(2);
  expect(report.completed[0]).not.toEqual(report.completed[1]);
});

test('throw when given invalid plans, actions, or actors', async () => {
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
  try {
    const engine = new Engine(params);
    return engine.run();
  } catch (err) {
    return err.message;
  }
}

test('context', async () => {
  const engine = new Engine({
    actors: {
      user1: 'selfTestUser'
    },
    actions: [
      ['user1', 'checkContext'],
      ['user1', 'checkContext'],
      ['user1', 'checkContext']
    ]
  });

  const report = await engine.run();
  expect(report.results).toEqual([3, 9, 15]);
});

test('action with parameters', async () => {
  const engine = new Engine({
    actors: {
      user1: 'selfTestUser'
    },
    actions: [
      [
        'user1',
        [
          ['checkParameters', 1000, { params1: 999 }],
          ['checkParameters', 1, { params1: 999 }]
        ]
      ],
      [
        'user1',
        [
          ['checkParameters', 1000, { params1: 111 }],
          ['checkParameters', 1, { params1: 111 }]
        ]
      ]
    ]
  });

  const report = await engine.run();
  expect(report.results[0].params1).toEqual(1000);
  expect(report.results[1].params1).toEqual(112);
});

test('action with random parameters', async () => {
  const engine = new Engine({
    actors: {
      user1: 'selfTestUser'
    },
    actions: [['user1', 'checkRandom']],
    seed: 123121
  });

  const report = await engine.run();
  expect(report.results[0]).toEqual(98);
});

test('async action', async () => {
  const engine = new Engine({
    actors: {
      user1: 'selfTestUser'
    },
    actions: [['user1', ['checkAsync', 'checkAsync']]]
  });

  const report = await engine.run();
  expect(report.success).toEqual(true);
});
