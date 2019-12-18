const args = require('commander');
args
  .option('-a, --address <hex>', 'address for defaultAccount (ETH_FROM)')
  .option('--addresses-config <file>', 'addresses.json config file')
  .option('--alert <type>', 'alerter type [console, rocketchat]', 'console')
  .option('--alert-level <level>', 'alert level [info, error]', 'info')
  .option('-c, --config <file>', 'config file name')
  .option('--continue', 'continue running the test plan on errors')
  .option(
    '-i, --iterations <num>',
    'repeat the testplan <num> times. 0 is infinite',
    1
  )
  .option('-k, --keystore <dir>', 'keystore for defaultAccount (ETH_KEYSTORE)')
  .option('--password', 'key password (ETH_PASSWORD)')
  .option('-p, --plan <name>', 'plan name')
  .option('--prng <string>', 'serialized PRNG state')
  .option(
    '-r, --rpc-accounts',
    'use RPC accounts instead of keystore (ETH_RPC_ACCOUNTS)'
  )
  .option('-s, --seed <seed>', 'seed to the PRNG')
  .option('--sleep <seconds>', 'seconds to wait between iterations', 0)
  .option('-u, --url <url>', 'RPC url')
  .option('-v, --verbose', 'verbose output');

args.parse(process.argv);

if (!args.plan) {
  console.error('Specify a plan with -p.');
  process.exit(1);
}

require('@babel/register');
const main = require('./core').default;
main(args.opts());
