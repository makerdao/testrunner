import Engine from '../src/engine';
import fs from 'fs';
import { ETH } from '@makerdao/dai';

const keydata = {
  address: 'b054303ff27afd3b1a600f86215c5128a83c38e9',
  crypto: {
    cipher: 'aes-128-ctr',
    ciphertext:
      'b1cfb1cb057030be68de265972bb1f39b85405272654bbb11641f8b6c89fea11',
    cipherparams: { iv: '92f01dda046fb074731e7dfcd36d7630' },
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      n: 262144,
      p: 1,
      r: 8,
      salt: '8b0f1461541a277d659f39b924b75fa99e894bf6c93f932867fd3f650907f1a9'
    },
    mac: 'f272df4d51e586f759e7881c80ac8141ffcbf7a7ab1a00a8c48af9707521e47a'
  },
  id: '499a5125-a2d8-45df-a88f-7a65eff18269',
  version: 3
};

// requires makerdao/testchain to be running
xtest('connect to an arbitrary testchain with a specific account', async () => {
  await new Promise(r => setTimeout(r, 2000));
  fs.mkdirSync('/tmp/testrunner', { recursive: true });
  fs.writeFileSync('/tmp/testrunner/key', JSON.stringify(keydata));

  const engine = new Engine({
    plans: ['selfTestChain'],
    address: keydata.address,
    keystore: '/tmp/testrunner',
    url: 'http://localhost:2000'
  });

  const report = await engine.run();
  if (report.error) console.error(report.error);
  expect(report).toEqual({
    results: ['0x' + keydata.address, ETH(100)],
    success: true,
    completed: [['user1', 'showAddress'], ['user1', 'checkEthBalance']]
  });
}, 10000);
