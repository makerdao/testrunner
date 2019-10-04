import Engine from '../src/engine';
import { setupCollateral, createMaker } from './helpers/utils';

test('can get basic system data to verify deployment', async () => {
  const engine = new Engine({
    actors: { user1: 'selfTestUser' },
    actions: [['user1', 'checkInitialConditions']],
    url: 'http://localhost:2000'
  });
  const maker = await createMaker('http://localhost:2000');
  await maker.authenticate();
  await setupCollateral(maker, 'ETH-A', { price: 150, debtCeiling: 50 });
  const report = await engine.run();
  expect(report.results[0].debtCeiling).toBe(1000000);
  expect(report.results[0].baseRate).toBe(0);
});
