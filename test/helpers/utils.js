const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const stopAllChains = async (chains, client) => {
  await asyncForEach(chains, async chain => {
    await client.stop(chain.id);
  });
};

export const deleteAllChains = async (chains, client) => {
  await asyncForEach(chains, async chain => {
    await client.api.deleteChain(chain.id);
  });
};
