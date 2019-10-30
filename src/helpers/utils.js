export function stringToBytes(str) {
  return '0x' + Buffer.from(str).toString('hex');
}
