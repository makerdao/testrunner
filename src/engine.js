import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import ALERTERS from './alerters';
import createClient from './testchain';
import assert from 'assert';
import shuffle from 'lodash/shuffle';
import castArray from 'lodash/castArray';
import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import debug from 'debug';
import RandomWeights from 'random-seed-weighted-chooser';
import fs from 'fs';
import path from 'path';
const log = debug('testrunner:engine');

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
          plugins: [[McdPlugin, { prefetch: false }]],
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

    const plan = this._options.plans
      ? this._importPlans(this._options.plans)
      : null;
    const actions = this._randomActionCheck(
      this._options.actions || plan.actions
    );

    let actors;
    log('importing actors...');
    try {
      actors = await this._importActors(this._options.actors || plan.actors);
    } catch (error) {
      return failAtIndex(-1, error);
    }

    log('running actions...');
    for (const action of actions) {
      if (!report.success) break;
      let [actorName, actionName] = action;
      try {
        const importedAction = ACTIONS[actionName];
        assert(importedAction, `Could not import action: ${actionName}`);

        if (!actorName) actorName = Object.keys(actors)[0];
        const importedActor = actors[actorName];
        assert(importedActor, `Missing actor: ${actorName}`);

        const result = await this._runAction(importedAction, importedActor);
        report.results.push(result);
        report.completed.push(action);
      } catch (error) {
        return failAtIndex(report.results.length, error);
      }
    }

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
      const actor = Array.isArray(actors[name])
        ? actors[name][0]
        : actors[name];
      assert(ACTORS[actor], `Could not import actor: { ${name}: ${actor} }`);
      result[name] = await ACTORS[actor](name, this._maker, this._options);
      log(`imported actor: ${name}`);
    }
    return result;
  }

  _importPlans(plans) {
    return plans.reduce(
      (result, plan) => {
        const importedPlan = PLANS[plan];
        assert(importedPlan, `Could not import plan: ${plan}`);

        if (importedPlan.mode === 'random') {
          const randomActor = this._randomActor({ ...importedPlan.actors });
          result.actors = { ...result.actors, ...randomActor };
          let actions = importedPlan.actions;
          actions.forEach((action, index) => {
            if (typeof action[0] === 'object') {
              actions.splice(
                index,
                1,
                ...this._randomAction(action).map(act => [
                  Object.keys(randomActor)[0],
                  act[1],
                  act[2]
                ])
              );
            }
          });
          actions = this._randomAction(importedPlan.actions).map(action => [
            Object.keys(randomActor)[0],
            action[1],
            action[2]
          ]);
          result.actions = result.actions.concat(actions);
        } else {
          result.actors = { ...result.actors, ...importedPlan.actors };
          result.actions = result.actions.concat(importedPlan.actions);
        }
        return result;
      },
      { actors: {}, actions: [] }
    );
  }

  _randomActor(actors) {
    const actor = RandomWeights.chooseWeightedObject(
      Object.keys(actors).map(actorName => ({
        name: actorName,
        a: actors[actorName],
        weight: actors[actorName][1] || 1
      }))
    );
    return { [actor.name]: actor.a };
  }

  _randomAction(actions) {
    if (actions[0][2] !== undefined) {
      const index = RandomWeights.chooseWeightedIndex(
        actions.map(a => a[2] || 1)
      );
      return [actions[index]];
    }
    return shuffle(actions);
  }

  _randomActionCheck(actions) {
    const orderedActions = [...actions];
    orderedActions.forEach((action, index) => {
      if (typeof action[0] === 'object') {
        orderedActions.splice(index, 1, ...this._randomAction(action));
      }
    });
    return orderedActions;
  }
}
