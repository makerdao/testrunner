import Engine from '../engine';
import omit from 'lodash/omit';

export default async function main(options) {
  try {
    // TODO read the `config` arg to get additional configuration from a JSON file
    options = {
      ...omit(options, ['plan']),
      plans: [options.plan]
    };

    const engine = new Engine(options);
    const { success } = await engine.run();
    await engine.stop();
    if (!success) console.log('Plan run did not succeed.');

    await engine.alert(options.alertLevel, options.alert);

    // this might need to change, in order to distinguish between plan run
    // failures and errors in the testrunner itself; perhaps we should only
    // return a non-zero exit status in the latter case, and rely upon reporter
    // output for the former
    process.exit(success ? 0 : 1);
  } catch (error) {
    const output = options.verbose || !error.message ? error : error.message;
    console.error(output);
    process.exit(1);
  }
}
