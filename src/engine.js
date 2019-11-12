import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import ALERTERS from './alerters';
import createClient from './testchain';
import assert from 'assert';
import shuffle from 'knuth-shuffle-seeded';
import castArray from 'lodash/castArray';
import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import debug from 'debug';
import RandomWeights from 'random-seed-weighted-chooser';
import fs from 'fs';
import path from 'path';
import { filter } from './helpers/utils';
const log = debug('testrunner:engine');
import { sleep } from './helpers/utils';

export default class Engine {
  constructor(options = {}) {
    const { plans, actions, actors } = options;
    assert(
      plans || (actors && actions),
      'Must provide { plans } OR { actors, actions }, but not both'
    );

    if (options.addressesConfig) {
      options.addressesConfig = path.resolve(options.addressesConfig);
      assert(
        fs.existsSync(options.addressesConfig),
        'Addresses config file must exist'
      );
      this._addressesConfig = require(options.addressesConfig);
    }

    if (options.iterations === undefined) {
      options.iterations = 1;
    }

    this._options = options;
  }

  async run() {
    log('running...');

    // TODO set this based on whether the plans/actions require a testchain
    const shouldUseTestchainClient = false;

    // use this to share state across all actions in a plan
    this._context = {};

    const report = (this.report = {
      results: [],
      success: true,
      completed: []
    });
    const failAtIndex = (index, error) => {
      report.success = false;
      report.error = error;
      report.errorIndex = index;
      return report;
    };

    if (shouldUseTestchainClient) {
      this._client = createClient();
      log(await this._client.api.listAllChains());
    } else if (this._options.url) {
      // n.b. this means that Maker is only set up when url is explicitly set--
      // this is only temporary
      try {
        log('setting up maker instance...');
        this._maker = await Maker.create('http', {
          url: this._options.url,
          plugins: [
            [
              McdPlugin,
              { addressOverrides: this._addressesConfig, prefetch: false }
            ]
          ],
          log: false,
          smartContract: {
            addressOverrides: this._addressesConfig
          }
        });
        log('succeeded in setting up maker instance.');
      } catch (error) {
        return failAtIndex(-1, error);
      }
    }

    let i = 0;
    do {
      const plan = this._options.plans
        ? this._importPlans(this._options.plans, this._options.seed + i)
        : null;

      let actors;
      log('importing actors...');
      try {
        actors = await this._importActors(this._options.actors || plan.actors);
      } catch (error) {
        return failAtIndex(-1, error);
      }

      const actions = await this._randomActionCheck(
        this._options.actions || plan.actions,
        actors,
        this._options.seed + i
      );

      log('running actions...');
      for (const action of actions) {
        if (!report.success) break;
        try {
          let [actorName, actionName] = action;
          const importedAction = ACTIONS[actionName];
          assert(importedAction, `Could not import action: ${actionName}`);

          const importedActor = actors[actorName];
          assert(importedActor, `Missing actor: ${actorName}`);

          const result = await this._runAction(importedAction, importedActor);
          report.results.push(result);
          report.completed.push(action);
        } catch (error) {
          return failAtIndex(report.results.length, error);
        }
      }
      await sleep(this._options.sleep * 1000);
    } while (++i !== parseInt(this._options.iterations));

    return report;
  }

  // `level` is similar to log levels -- e.g. if the level is "error", an
  // alerter should not produce any output unless there's an error
  async alert(level, alerters) {
    assert(this.report, 'Nothing to alert on yet');

    alerters = castArray(alerters);
    for (const name of alerters) {
      const factory = ALERTERS[name];
      assert(factory, `Unrecognized alerter name: ${name}`);
      await factory()(level, this.report);
    }
  }

  async stop() {
    // TODO
  }

  async _runAction(action, actor) {
    const { before, operation, after } = action;
    if (actor.address) this._maker.useAccountWithAddress(actor.address);

    const beforeResult = before
      ? await this._runStep(before.bind(action), actor)
      : undefined;

    const result = await this._runStep(
      operation.bind(action),
      actor,
      beforeResult
    );

    if (after) await this._runStep(after.bind(action), actor, result);
    return result;
  }

  async _filterActions(actions, importedActor) {
    return await filter(actions, async action => {
      const importedAction =
        ACTIONS[typeof action === 'object' ? action[0] : action];
      if (importedAction.before === undefined) return true;
      if (importedActor.address)
        this._maker.useAccountWithAddress(importedActor.address);
      return await this._runStep(
        importedAction.before.bind(importedAction),
        importedActor
      );
    });
  }

  _runStep(step, actor, lastResult) {
    return step(actor, {
      maker: this._maker,
      context: this._context,
      lastResult
    });
  }

  async _importActors(actors) {
    const result = {};
    for (let name of Object.keys(actors)) {
      assert(
        ACTORS[actors[name]],
        `Could not import actor: { ${name}: ${actors[name]} }`
      );
      result[name] = await ACTORS[actors[name]](
        name,
        this._maker,
        this._options
      );
      log(`imported actor: ${name}`);
    }
    return result;
  }

  _importPlans(plans, seed) {
    return plans.reduce(
      (result, plan) => {
        const importedPlan = PLANS[plan];
        assert(importedPlan, `Could not import plan: ${plan}`);
        result.actors = { ...result.actors, ...importedPlan.actors };
        const actions =
          importedPlan.mode === 'random'
            ? shuffle(importedPlan.actions, seed)
            : importedPlan.actions;
        result.actions = result.actions.concat(actions);
        return result;
      },
      { actors: {}, actions: [] }
    );
  }

  _randomElement(list, seed) {
    const index = RandomWeights.chooseWeightedIndex(
      list.map(a => a[1] || 1),
      seed
    );
    return typeof list[index] === 'object' ? list[index][0] : list[index];
  }

  async _randomActionCheck(actions, actors, seed) {
    let orderedActions = [];
    for (const action of [...actions]) {
      if (action.length === 1) {
        orderedActions.push(...shuffle(action[0], seed));
      } else {
        const selectedActor =
          typeof action[0] === 'object'
            ? this._randomElement(action[0], seed)
            : action[0];
        const selectedAction =
          typeof action[1] === 'object'
            ? this._randomElement(
                await this._filterActions(action[1], actors[selectedActor]),
                seed
              )
            : action[1];
        orderedActions.push([selectedActor, selectedAction]);
      }
    }
    return orderedActions;
  }
}
