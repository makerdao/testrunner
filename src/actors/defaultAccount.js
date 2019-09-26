export default async function(name, maker) {
  // this is a bare-bones implementation; it won't work correctly with a maker
  // instance that's been set up with multiple accounts
  return {
    address: maker.currentAccount()
  };
}
