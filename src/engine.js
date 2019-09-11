import ACTORS from './actors/index';
import ACTIONS from './actions/index';

export default class Engine {
  constructor() {

  }

  async run({ plans, actions, actors }) {
    let report = {
      results: [],
      success: true,
      completed: []
    }
    const plan = plans ? this._importPlans(plans) : null;
    const items = actions ? [ ...actions ] : plan.items;
    const users = actors ? this._importUsers(actors) : plan.users;

    for (const item of items) {
      if (report.success) {
        const importedAction = ACTIONS[item[1]];
        const importedUser = users[item[0]]
        try {
          const result = await this._runAction(importedAction, importedUser);
          report.results.push(result);
          report.completed.push(item);
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

  _importUsers(actors) {
    let users = {};

    Object.keys(actors).forEach(name => {
      users[name] = ACTORS[actors[name]](name);
    });

    return users;
  }

  _importPlans(plans) {
    let users = {};
    let items = [];

    plans.forEach(plan => {
      const importedPlan = (require(`./plans/${plan}.js`)).default;
      users = this._importUsers(importedPlan.actors);
      importedPlan.actions.forEach(action => {
        items.push(action);
      });
    });

    return {
      users: users,
      items: items
    }
  }
}
