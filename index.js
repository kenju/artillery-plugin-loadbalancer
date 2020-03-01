const debug = require('debug')('plugin:loadbalancer');

module.exports = {
  Plugin
};

function Plugin(script, ee) {
  this.script = script;
  this.ee = ee;

  const { loadbalancer: config } = this.script.config.plugins

  if (!script.config.processor) {
    script.config.processor = {};
  }

  script.scenarios.forEach(function (scenario) {
    scenario.beforeRequest = [].concat(scenario.beforeRequest || []);
    scenario.beforeRequest.push('loadBalance');
  });

  script.config.processor.loadBalance = loadBalance(config);

  debug('plugin initialized');
  debug(config)
  return this;
};

function* roundRobin(config) {
  const { targets } = config
  let idx = 0

  while (true) {
    const { target } = targets[idx++]

    // when reaches to the end, set index to the first item
    if (idx == (targets.length)) {
      idx = 0
    }

    yield target
  }
}

// TODO: support weighted roundrobin
function loadBalance(config) {
  const { strategy } = config

  if (strategy !== 'roundrobin') {
    throw new Error(`strategy=${strategy} is not supported.`)
  }

  const iterator = roundRobin(config)

  return (context) => {
    const nextTarget = iterator.next().value
    debug(`nextTarget=${nextTarget}`)
    context.vars.target = nextTarget
  }
}
