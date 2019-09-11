// this is the part that pulls in all the dependencies
// so that actors and actions don't have to handle
// their own imports
import cdpUser from './actors/cdpUser';

export default class Engine {
  constructor() {

  }

  async run({ plans, actions, actors }) { // eslint-disable-line no-unused-vars
    // specify plans or actions/actors, not both

    // run the plans
    // for each plan:
    // initialize the users needed
    // run the actions in order, passing user as argument

    let report = {
      results: [],
      success: true,
      completed: []
    }
    let items = actions ? [ ...actions ] : [];
    let users = actors ? this._importUsers(actors) : {};

    if (plans) {
      const plan = this._importPlans(plans);
      users = plan.users;
      items = plan.items;
    }

    for (const item of items) {
      if (report.success) {
        const importedAction = (require(`./actions/${item[1]}`)).default;
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

  _importUsers(actors) {
    let users = {};
    Object.keys(actors).forEach(name => {
      users[name] = this._actorsMap()[actors[name]](name);
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

  _actorsMap() {
    return {
      'cdpUser': cdpUser
    }
  }

  async _runAction(action, actor) {
    if (action.before) await action.before(actor);
    const result = await action.operation(actor);
    if (action.after) await action.after(actor);
    return result;
  }
}
