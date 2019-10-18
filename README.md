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
  --alert <type>         alerter type [console, rocketchat] (default: "console")
  --alert-level <level>  alert level [info, error] (default: "info")
  -c, --config <file>    config file name
  -k, --keystore <dir>   keystore for defaultAccount (ETH_KEYSTORE)
  --password             key password (ETH_PASSWORD)
  -p, --plan <name>      plan name
  -r, --rpc-accounts     use RPC accounts instead of keystore (ETH_RPC_ACCOUNTS)
  -u, --url <url>        RPC url
  --verbose              verbose output
  -h, --help             output usage information
```

Reads environment variables, in imitation of [seth](https://github.com/dapphub/dapptools/blob/master/src/seth/README.md).

### Example

If you wanted to run the same plan as [url.test.js](https://github.com/makerdao/testrunner/blob/master/test/url.test.js), but from the command line, it would look like this:

```shell
yarn cli -p selfTestChain \
  -u http://localhost:2000 \
  -a b054303ff27afd3b1a600f86215c5128a83c38e9 \
  -k /tmp/testrunner
```

### Keystore files

If you have a private key string literal and you want to create a keystore file from it, save it to a text file named e.g. `foo` and then run `geth account import foo`. This will create a keystore file in the default location, which on MacOS is `~/Library/Ethereum/keystore`.
