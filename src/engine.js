import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import createClient from './testchain';
import assert from 'assert';

export default class Engine {
  constructor(client) {
    // Probably not ideal to set this to a promise, but
    // since `run` is the only externally facing function
    // it might not be so bad in this case
    this._client = client ? client : this._importClient();
  }

  async run({ plans, actions, actors } = {}) {
    assert(
      (plans || (actors && actions)) && Object.keys(arguments[0]).length < 3,
      'Must provide plans or actors/actions (but not both)'
    );

    console.log(await this._client.api.listAllChains());

    const plan = plans ? this._importPlans(plans) : null;
    actions = actions ? actions : plan.actions;
    actors = actors ? this._importActors(actors) : plan.actors;

    let report = {
      results: [],
      success: true,
      completed: []
    };

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
    const result = await action.operation(actor);
    if (action.after) await action.after(actor);
    return result;
  }

  _importActors(actors) {
    return Object.keys(actors).reduce((result, name) => {
      assert(
        ACTORS[actors[name]],
        `Could not import actor: { ${name}: ${actors[name]} }`
      );
      result[name] = ACTORS[actors[name]](name);
      if (!result[name].privateKey)
        console.warn(`{ ${name}: ${actors[name]} } has no private key!`);
      return result;
    }, {});
  }

  _importPlans(plans) {
    return plans.reduce(
      (result, plan) => {
        const importedPlan = PLANS[plan];
        assert(importedPlan, `Could not import plan: ${plan}`);

        result.actors = {
          ...result.actors,
          ...this._importActors(importedPlan.actors)
        };
        importedPlan.actions.forEach(action => {
          result.actions.push(action);
        });

        return result;
      },
      { actors: {}, actions: [] }
    );
  }

  _importClient() {
    return createClient();
  }
}
