import assert from 'assert';

export default {
  before: async () => {
    return 2;
  },
  operation: async (user, { lastResult }) => {
    const a = lastResult;
    const b = await 2;
    return a + b;
  },
  after: (user, { lastResult }) => {
    assert(lastResult === 4, 'value is not 4');
    assert(lastResult === 3, 'value is not 3');
  },
  category: 'selfTest'
};
