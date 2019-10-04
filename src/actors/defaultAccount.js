import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fromV3 } from 'ethereumjs-wallet';
import debug from 'debug';
const log = debug('testrunner:defaultAccount');

export default async function(name, maker, options) {
  assert(maker, 'defaultAccount needs a maker instance');
  const useRpcAccounts = process.env.ETH_RPC_ACCOUNTS || options.rpcAccounts;

  let address = options.address || process.env.ETH_FROM;
  if (address && !address.startsWith('0x')) address = '0x' + address;

  if (useRpcAccounts) {
    const existingAccounts = maker.listAccounts();
    if (
      !existingAccounts.find(
        a =>
          a.type === 'provider' &&
          (a.address === address || (!address && a.name === 'default'))
      )
    ) {
      await maker.addAccount({ type: 'provider', address });
    }
  } else {
    assert(
      address,
      'to use defaultAccount, address or rpcAccounts must be set'
    );
    const keystore = options.keystore || process.env.ETH_KEYSTORE;
    const password = options.password || process.env.ETH_PASSWORD || '';
    const key = findKeyFromStore(address, keystore, password);
    const data = await maker.addAccount({ type: 'privateKey', key });
    assert(
      data.address === address,
      `address mismatch: ${address}, ${data.address}`
    );
  }

  return { address };
}

function findKeyFromStore(address, keystore, password) {
  assert(keystore, '--keystore or ETH_KEYSTORE must be set');

  let key;
  for (const filename of fs.readdirSync(keystore)) {
    const fullpath = path.join(keystore, filename);
    const file = fs.readFileSync(fullpath).toString();

    try {
      const data = JSON.parse(file);
      if (data.address !== address.replace(/^0x/, '')) continue;
    } catch (err) {
      continue;
    }
    log(`found matching keystore file at ${fullpath}`);
    const wallet = fromV3(file, password);
    key = wallet._privKey.toString('hex');
    break;
  }

  assert(
    key,
    `Couldn't find key matching ${address.substring(0, 8)}... in ${keystore}`
  );

  return key;
}
