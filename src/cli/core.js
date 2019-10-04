import Engine from '../engine';
import omit from 'lodash/omit';

export default async function(options) {
  // TODO read the `config` arg to get additional configuration from a JSON file
  options = {
    ...omit(options, ['plan', 'config']),
    plans: [options.plan]
  };

  const engine = new Engine(options);
  await engine.run();

  await engine.alert(options.alertLevel, options.alert);
  await engine.stop();
  process.exit(engine.report.success ? 0 : 1);
}
