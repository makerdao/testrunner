export default async function(name, maker) {
  return {
    address: maker.currentAccount()
  };
}
