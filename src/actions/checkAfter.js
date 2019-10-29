import assert from 'assert';

export default {
  operation: async () => {
    const a = await 2;
    const b = await 2;
    return a + b;
  },
  after: (user, _, value) => {
    assert(value === 4, 'value is not 4');
    assert(value === 3, 'value is not 3');
  }
};
