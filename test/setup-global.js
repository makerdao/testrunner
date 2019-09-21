import createClient from '../src/testchain';

module.exports = async function() {
  global.client = createClient();
};
