import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import createClient from './testchain';
import assert from 'assert';
import shuffle from 'lodash/shuffle';
import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';

export default class Engine {
  constructor(options = {}) {
    const { plans, actions, actors } = options;
    assert(
      plans || (actors && actions),
      'Must provide { plans } OR { actors, actions }, but not both'
    );
    this._options = options;
  }

  async run() {
    // TODO set this based on whether the plans/actions require a testchain
    const shouldUseTestchainClient = false;

    if (shouldUseTestchainClient) {
      this._client = createClient();
      console.log(await this._client.api.listAllChains());
    } else if (this._options.url) {
      this._maker = await Maker.create('http', {
        url: this._options.url,
        plugins: [[McdPlugin, { network: 'testnet' }]]
      });
    }

    const plan = this._options.plans
      ? this._importPlans(this._options.plans)
      : null;
    const actions = this._randomActionCheck(
      this._options.actions || plan.actions
    );
    const actors = await this._importActors(
      this._options.actors || plan.actors
    );
    const report = { results: [], success: true, completed: [] };

    for (const action of actions) {
      if (report.success) {
        const importedAction = ACTIONS[action[1]];
        assert(importedAction, `Could not import action: ${action[1]}`);
        const importedActor = actors[action[0]];

        try {
          const result = await this._runAction(importedAction, importedActor);
          report.results.push(result);
          report.completed.push(action);
        } catch (err) {
          report.success = false;
          report.error = err;
          report.errorIndex = 0 + report.results.length;
        }
      }
    }

    return report;
  }

  async _runAction(action, actor) {
    const { before, operation, after } = action;

    // TODO switch maker account to match actor

    if (before) await this._runStep(before.bind(action), actor);
    const result = await this._runStep(operation.bind(action), actor);
    if (after) await this._runStep(after.bind(action), actor);
    return result;
  }

  _runStep(step, actor) {
    assert(
      step.length < 2 || this._maker,
      'Action requires Maker instance but none exists'
    );
    return step(actor);
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
    }
    return result;
  }

  _importPlans(plans) {
    return plans.reduce(
      (result, plan) => {
        const importedPlan = PLANS[plan];
        assert(importedPlan, `Could not import plan: ${plan}`);
        result.actors = { ...result.actors, ...importedPlan.actors };

        const actions =
          importedPlan.mode === 'random'
            ? shuffle(importedPlan.actions)
            : importedPlan.actions;
        result.actions = result.actions.concat(actions);
        return result;
      },
      { actors: {}, actions: [] }
    );
  }

  _randomActionCheck(actions) {
    const orderedActions = [...actions];
    orderedActions.forEach((action, index) => {
      if (typeof action[0] === 'object') {
        orderedActions.splice(index, 1, ...shuffle(action));
      }
    });
    return orderedActions;
  }
}
