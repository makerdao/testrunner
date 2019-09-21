import createClient from '../src/testchain';

beforeAll(async () => {
  createClient();
});
test('basic setup', async () => {
  expect(1 + 1).toEqual(2);
});
