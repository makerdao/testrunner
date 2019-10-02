const args = require('commander');
args
  .option('-a, --address <hex>', 'address for defaultAccount (ETH_FROM)')
  .option('-c, --config <file>', 'config file name')
  .option('-k, --keystore <dir>', 'keystore for defaultAccount (ETH_KEYSTORE)')
  .option('--password', 'key password (ETH_PASSWORD)')
  .option('-p, --plan <name>', 'plan name')
  .option('-r, --rpc-accounts', 'use RPC accounts instead of keystore (ETH_RPC_ACCOUNTS)')
  .option('-u, --url <url>', 'RPC url');

args.parse(process.argv);

if (!args.plan) {
  console.error('Specify a plan with -p.');
  process.exit(1);
}

require('@babel/register');
const main = require('./core').default;
main(args.opts());
