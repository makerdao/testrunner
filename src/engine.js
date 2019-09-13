import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import assert from 'assert';

export default class Engine {
  constructor() {
    // Set up staxx here
  }

  async run({ plans, actions, actors } = {}) {
    assert(
      (plans || (actors && actions)) && Object.keys(arguments[0]).length < 3,
      'must provide plans or actors/actions (but not both)'
    );

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
      result[name] = ACTORS[actors[name]](name);
      return result;
    }, {});
  }

  _importPlans(plans) {
    return plans.reduce(
      (result, plan) => {
        const importedPlan = PLANS[plan];
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
}
