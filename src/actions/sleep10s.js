export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  before: () => {},
  operation: async () => {
    await sleep(10000);
    return true;
  },
  after: () => {},
  category: ''
};
