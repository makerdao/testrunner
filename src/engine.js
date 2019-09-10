// this is the part that pulls in all the dependencies
// so that actors and actions don't have to handle
// their own imports

export default class Engine {
  constructor() {

  }

  run({ plans, planLiterals }) { // eslint-disable-line no-unused-vars
    // specify plans or actions, not both

    // run the plans
    // for each plan:
    // initialize the users needed
    // run the actions in order, passing user as argument
    let actors = {}, actions = [], results = [];

    if (plans) {
      plans.forEach(plan => {
        const importedPlan = (require(`./plans/${plan}.js`)).default;
        Object.keys(importedPlan.actors).forEach(name => {
          actors[name] = (require(`./actors/${importedPlan.actors[name]}`)).default;
        });
        importedPlan.actions.forEach(action => {
          actions.push(action);
        });
      });
    }

    actions.forEach(async action => {
      const importedAction = (require(`./actions/${action[1]}`)).default;
      const result = await importedAction.operation(actors[action[0]], action[0]);
      results.push(result);
    });

    return { results, success: true };
  }
}
