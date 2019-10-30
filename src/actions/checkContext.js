export default {
  before: (_, { context }) => {
    if (!context.foo) context.foo = 0;
    context.foo += 1;
  },
  operation: (_, { context }) => {
    context.foo += 2;
    return context.foo;
  },
  after: (_, { context }) => {
    context.foo += 3;
  },
  category: 'selfTest'
};
