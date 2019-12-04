import prng from '../src/prng';

test('two different random numbers, no seed', async () => {
  const rand = new prng();
  const number1 = rand.rng();
  const number2 = rand.rng();

  expect(number1).not.toEqual(number2);
});

test('seeded results', async () => {
  const rand = new prng({ seed: 91278 });
  const number1 = rand.rng();
  const number2 = rand.rng();

  expect(number1).toEqual(0.0672841190571227);
  expect(number2).toEqual(0.9427412274561371);
});

test('saved state', async () => {
  const rand = new prng({ seed: 91278 });
  const number1 = rand.rng();

  const state = rand.state();

  const rand2 = new prng({ state: state });
  const number2 = rand2.rng();

  expect(number1).toEqual(0.0672841190571227);
  expect(number2).toEqual(0.9427412274561371);
});

test('saved state in base64 format', async () => {
  const rand = new prng({ seed: 91278 });
  const number1 = rand.rng();

  const state = rand.base64State();

  const rand2 = new prng({ base64State: state });
  const number2 = rand2.rng();

  expect(number1).toEqual(0.0672841190571227);
  expect(number2).toEqual(0.9427412274561371);
});

test('known base64 state', async () => {
  const state =
    'g6FpB6FqzMihU9wBACMLzKvM72kKzIEozLrMnXFDzLzMpczZfikFzKLM7sz9bMzFzPJJzK3MisyvR0gt' +
    'YMzJzL12zL9MzPfM6cynQD5WMWjMmybMwMzEERRPA2bMrMyhzMg0zI4WO0YyzLjM+33MgMzwCMzSzJ4BzL4dzPnMqlVi' +
    'QhfM0cyuUszaRMzbPV9wcsyxzIMHzIZYKszDzIzMi8znzILM4hDMoD/Mh8yNzLDM8U13QTXM/MyWfE4JzLbMuczGanrM' +
    '/yFlzJLMkV7MpMyyzKM8zMfMzjpjzJTMqczTzM8CH8yfzNDMylrM5hvM3sy0zM3MmVl/zMvM48zrEl04zNg5zLcZJ1HM' +
    '9czXcyx0zODM+MzWADZQZDPM3XnM38ztzPNvD8y7IhzM7Mz6Lg4wzI8EW8zozIUezJVFzLXM4RrMs1wgDSTM9szUzIlu' +
    'ezcYzOoMdXjMhMyoYcyIU0rMmszlSwbMwcyYzJPMpszVL8zcZ8yczJfM5CttJWsTzP7Mwsz0zMxUV8yQFQ==';

  const rand = new prng({ base64State: state });
  const number = rand.rng();
  expect(number).toEqual(0.9427412274561371);
});

test('shuffle array', async () => {
  const rand = new prng({ seed: 12345 });
  const shuffled = rand.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  expect(shuffled).toEqual([9, 5, 6, 2, 3, 8, 4, 7, 1, 10]);
});

test('pick array index', async () => {
  const rand = new prng({ seed: 123453 });
  const indexes = [];
  for (let i = 0; i < 20; i++)
    indexes.push(rand.randomWeightedIndex([9, 1, 9]));
  expect(indexes).toEqual([
    2,
    0,
    2,
    2,
    0,
    2,
    2,
    0,
    2,
    0,
    2,
    1,
    2,
    2,
    0,
    2,
    2,
    1,
    2,
    2
  ]);
});

test('pick array index with only one element', async () => {
  const rand = new prng({ seed: 123453 });
  const index = rand.randomWeightedIndex([1]);
  expect(index).toEqual(0);
});
