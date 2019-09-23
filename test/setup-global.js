import createClient from '../src/testchain';

// Do we want jest to set up a client automatically?
// If so, it should be here. If not, we don't need this

module.exports = async function() {
  global.client = createClient();
};
