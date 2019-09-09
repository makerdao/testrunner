// this is the part that pulls in all the dependencies
// so that actors and actions don't have to handle
// their own imports

export default class Engine {
  constructor() {

  }

  run({ plans, actions }) { // eslint-disable-line no-unused-vars
    // specify plans or actions, not both

    // run the plans
    // for each plan:
    // initialize the users needed
    // run the actions in order, passing user as argument
  }
}
