# Testrunner
Automated Integration Test Runner

![](http://clipart.toonarific.com/data/thumbnails/76/roadrunner005.gif)

## Command-line interface

```shell
❯ yarn cli -h
yarn run v1.17.3
$ node ./src/cli -h
Usage: cli [options]

Options:
  -a, --address <hex>    address for defaultAccount (ETH_FROM)
  -c, --config <file>    config file name
  -k, --keystore <file>  keystore for defaultAccount (ETH_KEYSTORE)
  --password             key password (ETH_PASSWORD)
  -p, --plan <name>      plan name
  -r, --rpc-accounts     use RPC accounts instead of keystore (ETH_RPC_ACCOUNTS)
  -u, --url <url>        RPC url
  -h, --help             output usage information
```

Reads environment variables, in imitation of [seth](https://github.com/dapphub/dapptools/blob/master/src/seth/README.md).
