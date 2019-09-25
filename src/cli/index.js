const args = require('commander');
args
  .option('-c, --config <file>', 'config file name')
  .option('-p, --plan <name>', 'plan name')
  .option('-u, --url <url>', 'RPC url');

args.parse(process.argv);

if (!args.plan) {
  console.error('Specify a plan with -p.');
  process.exit(1);
}

require('@babel/register');
const main = require('./core').default;
main(args.opts());
