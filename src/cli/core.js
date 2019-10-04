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

  // TODO allow changing alert level & alerters with CLI args
  await engine.alert('info', 'console');
  await engine.stop();
  process.exit(engine.report.success ? 0 : 1);
}
