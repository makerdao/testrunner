const babelTest = (arg1, ...args) => {
  let [arg2, arg3] = args;
  console.log(arg2, arg3);
  for (let arg of args) {
    let arg2 = 'is the best';
    console.log(`${arg} ${arg2}`);
  }
  console.log('*************************');
  console.log('Hello babel my old friend');
  console.log('*************************');
};

module.exports = babelTest;
