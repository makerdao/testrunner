import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import createClient from './testchain';
import assert from 'assert';
import shuffle from 'lodash/shuffle';

export default class Engine {
  constructor(options = {}) {
    const { plans, actions, actors, url } = options;
    assert(
      (plans || (actors && actions)) && Object.keys(arguments[0]).length < 3,
      'Must provide { plans } OR { actors, actions }, but not both'
    );

    this._plans = plans;
    this._actors = actors;
    this._actions = actions;
    this._url = url;
  }

  async run() {
    // TODO set this based on whether the plans/actions require a testchain
    const shouldUseTestchainClient = false;

    if (shouldUseTestchainClient) {
      this._client = createClient();
      console.log(await this._client.api.listAllChains());
    }

    const plan = this._plans ? this._importPlans(this._plans) : null;
    const actions = this._randomActionCheck(this._actions || plan.actions);
    const actors = await this._importActors(this._actors || plan.actors);
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
    if (action.before) await action.before(actor);
    // TODO switch maker account to match actor
    const result = await action.operation(actor, this._maker);
    if (action.after) await action.after(actor);
    return result;
  }

  async _importActors(actors) {
    const result = {};
    for (let name of Object.keys(actors)) {
      assert(
        ACTORS[actors[name]],
        `Could not import actor: { ${name}: ${actors[name]} }`
      );
      result[name] = await ACTORS[actors[name]](name, this._maker);
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
