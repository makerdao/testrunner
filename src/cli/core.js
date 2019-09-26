import Engine from '../engine';
import omit from 'lodash/omit';

export default async function(options) {
  // TODO read the `config` arg to get additional configuration from a JSON file
  options = {
    ...omit(options, ['plan', 'config']),
    plans: [options.plan]
  };

  const engine = new Engine(options);
  const report = await engine.run();
  console.log(report);
}
