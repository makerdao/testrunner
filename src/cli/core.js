import Engine from '../engine';
import omit from 'lodash/omit';

export default async function main(options) {
  try {
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
  } catch (error) {
    const output = options.verbose || !error.message ? error : error.message;
    console.error(output);
    process.exit(1);
  }
}
