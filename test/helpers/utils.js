import Maker from '@makerdao/dai';
import McdPlugin, { ETH, GNT, USD } from '@makerdao/dai-plugin-mcd';
import { createCurrencyRatio } from '@makerdao/currency';
import ethAbi from 'web3-eth-abi';
import assert from 'assert';
import BigNumber from 'bignumber.js';
import { utils as ethersUtils } from 'ethers';

const RAY = new BigNumber('1e27');

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function setupCollateral(maker, ilk, options = {}) {
  const proxy = await maker.currentProxy();
  const cdpType = maker.service('mcd:cdpType').getCdpType(null, ilk);
  const { currency } = cdpType;

  // The following currencies don't support `approveUnlimited`
  const skipApproval = [ETH, GNT];

  if (!skipApproval.includes(currency)) {
    await maker.getToken(currency).approveUnlimited(proxy);
  }
  if (options.mint) await mint(maker, currency(options.mint));
  if (options.price)
    await setPrice(
      maker,
      createCurrencyRatio(USD, currency)(options.price),
      ilk
    );
}

export async function createMaker(url) {
  return await Maker.create('http', {
    url,
    plugins: [[McdPlugin, { network: 'testnet', prefetch: false }]],
    log: false
  });
}

async function setPrice(maker, ratio, ilk) {
  const scs = maker.service('smartContract');
  const { symbol } = ratio.denominator;
  const pip = scs.getContract('PIP_' + symbol);

  // using uint here instead of bytes32 so it gets left-padded
  const val = ethAbi.encodeParameter('uint', ratio.toFixed('wei'));

  await pip.poke(val);
  await scs.getContract('MCD_SPOT').poke(stringToBytes(ilk));

  //check that setPrice worked
  const data = maker.service('mcd:systemData');
  const { spot } = await data.vat.ilks(stringToBytes(ilk));
  const spotBN = new BigNumber(spot.toString()).dividedBy(RAY);
  const par = await data.spot.par();
  const parBN = new BigNumber(par.toString()).dividedBy(RAY);
  const { mat } = await data.spot.ilks(stringToBytes(ilk));
  const matBN = new BigNumber(mat.toString()).dividedBy(RAY);
  assert(
    ratio.toNumber() ===
      spotBN
        .times(parBN)
        .times(matBN)
        .toNumber(),
    'setPrice did not work'
  );
}

function stringToBytes(str) {
  assert(!!str, 'argument is falsy');
  assert(typeof str === 'string', 'argument is not a string');
  return '0x' + Buffer.from(str).toString('hex');
}

async function mint(maker, amount) {
  // the current account must own the token contract
  const token = maker.getToken(amount.symbol);
  const startBalance = await token.balance();
  await token._contract['mint(uint256)'](amount.toFixed('wei'));
  const endBalance = await token.balance();
  expect(endBalance.minus(startBalance)).toEqual(amount);
}

export function stringToBytes32(text, pad = true) {
  var data = ethersUtils.toUtf8Bytes(text);
  if (data.length > 32) {
    throw new Error('too long');
  }
  if (pad) data = ethersUtils.padZeros(data, 32);
  return ethersUtils.hexlify(data);
}
