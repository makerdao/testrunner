import fs from 'fs';

export default fs
  .readdirSync(__dirname)
  .filter(f => f !== 'index.js')
  .map(f => f.replace('.js', ''))
  .reduce((a, name) => {
    a[name] = require(`./${name}`).default;
    return a;
  }, {});
