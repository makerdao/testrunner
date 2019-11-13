export function stringToBytes(str) {
  return '0x' + Buffer.from(str).toString('hex');
}

export async function filter(arr, callback) {
  const mask = await Promise.all(arr.map(callback));
  return arr.filter((item, i) => mask[i]);
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
