export default {
  operation: () => {
    throw new Error('failure in operation');
  },
  category: 'selfTest'
};
