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
    let actors = {}, actions = [];

    if (plans) {
      plans.forEach(plan => {
        const importedPlan = (require(`./plans/${plan}.js`)).default;
        Object.keys(importedPlan.actors).forEach(name => {
          actors[name] = importedPlan.actors[name];
        });
        importedPlan.actions.forEach(action => {
          actions.push(action);
        });
      });
    }
  }
}
