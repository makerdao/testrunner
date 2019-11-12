export function stringToBytes(str) {
  return '0x' + Buffer.from(str).toString('hex');
}

export async function filter(arr, callback) {
  const fail = Symbol();
  return (await Promise.all(
    arr.map(async item => ((await callback(item)) ? item : fail))
  )).filter(i => i !== fail);
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
