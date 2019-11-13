import { sleep } from '../helpers/utils';

export default {
  before: () => {},
  operation: async () => {
    await sleep(10000);
    return true;
  },
  after: () => {},
  category: ''
};
