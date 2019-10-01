Actor files should export an async function that takes `name`, `maker`, and `options` arguments. They should return an object that has an `address` key, at least.

`maker` is a Maker instance; the async function should call `maker.addAccount` so that the `maker` instance can later switch to the actor using `maker.useAccountWithAddress`, unless the actor doesn't interact with a blockchain.
