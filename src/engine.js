// this is the part that pulls in all the dependencies
// so that actors and actions don't have to handle
// their own imports

export default class Engine {
  constructor() {

  }

  run({ plans, actions, actors }) { // eslint-disable-line no-unused-vars
    // specify plans or actions/actors, not both

    // run the plans
    // for each plan:
    // initialize the users needed
    // run the actions in order, passing user as argument

    let results = [];
    let items = actions ? [ ...actions ] : [];
    let users = actors ? this._setUsers(actors) : {};

    if (plans) {
      plans.forEach(plan => {
        const importedPlan = (require(`./plans/${plan}.js`)).default;
        users = this._setUsers(importedPlan.actors);
        importedPlan.actions.forEach(action => {
          items.push(action);
        });
      });
    }

    items.forEach(async action => {
      let result;
      const importedAction = (require(`./actions/${action[1]}`)).default;
      try {
        result = await importedAction.operation(users[action[0]], action[0]);
      } catch (err) {
        console.error(err);
      }
      results.push(result);
    });

    return { results, success: true };
  }

  _setUsers(actors) {
    let users = {};
    Object.keys(actors).forEach(name => {
      users[name] = (require(`./actors/${actors[name]}`)).default;
    });
    return users;
  }
}
