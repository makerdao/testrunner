import ACTORS from './actors';
import ACTIONS from './actions';
import PLANS from './plans';
import createClient from './testchain';
import assert from 'assert';
import shuffle from 'lodash/shuffle';
import Maker from '@makerdao/dai';
import McdPlugin, {
  ETH,
  REP,
  ZRX,
  OMG,
  BAT,
  DGD
} from '@makerdao/dai-plugin-mcd';
import debug from 'debug';
const log = debug('testrunner:engine');

export default class Engine {
  constructor(options = {}) {
    const { plans, actions, actors } = options;
    assert(
      plans || (actors && actions),
      'Must provide { plans } OR { actors, actions }, but not both'
    );
    this._options = options;
    this._currencies = {
      ETH,
      REP,
      ZRX,
      OMG,
      BAT,
      DGD
    };
  }

  async run() {
    log('running...');

    // TODO set this based on whether the plans/actions require a testchain
    const shouldUseTestchainClient = false;
    const report = { results: [], success: true, completed: [] };
    const failAtIndex = (index, error) => {
      report.success = false;
      report.error = error;
      report.errorIndex = index;
      return report;
    };

    if (shouldUseTestchainClient) {
      this._client = createClient();
      log(await this._client.api.listAllChains());
    } else if (this._options.url) {
      // n.b. this means that Maker is only set up when url is explicitly set--
      // this is only temporary
      try {
        this._maker = await Maker.create('http', {
          url: this._options.url,
          plugins: [[McdPlugin, { network: 'testnet', prefetch: false }]],
          log: false
        });
      } catch (error) {
        return failAtIndex(-1, error);
      }
    }

    const plan = this._options.plans
      ? this._importPlans(this._options.plans)
      : null;
    const actions = this._randomActionCheck(
      this._options.actions || plan.actions
    );

    let actors;
    log('importing actors...');
    try {
      actors = await this._importActors(this._options.actors || plan.actors);
    } catch (error) {
      return failAtIndex(-1, error);
    }

    log('running actions...');
    for (const action of actions) {
      if (report.success) {
        const importedAction = ACTIONS[action[1]];
        assert(importedAction, `Could not import action: ${action[1]}`);
        const importedActor = actors[action[0]];

        try {
          const result = await this._runAction(importedAction, importedActor);
          report.results.push(result);
          report.completed.push(action);
        } catch (error) {
          return failAtIndex(report.results.length, error);
        }
      }
    }

    return report;
  }

  async stop() {
    // TODO
  }

  async _runAction(action, actor) {
    console.log(this._options);
    const { before, operation, after } = action;
    if (actor.address) this._maker.useAccountWithAddress(actor.address);
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
    return step(actor, this._maker, this._currencies);
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
      log(`imported actor: ${name}`);
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
