// this is the entry at index 8 in testAccounts.json in the dai.js test suite
const address = '0x75be2d1186d2806b61f1ac984475979eeed18702';

export default async function(name, maker) {
  await maker.addAccount({ type: 'provider', address });
  return { address };
}
