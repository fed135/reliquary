/** 
 * Reliquary Entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Events = require('./src/Events');
const Pool = require('./src/Pool');
const Hooks = require('./src/hooks');
const Agents = require('./src/agents');

/* Methods -------------------------------------------------------------------*/

function monitor(params) {
    const config = Object.assign({
        agents: {},
        hooks: {}
    }, params);

    // Agents
    const agents = Object.keys(config.agents)
        .map((agent_name) => new Pool(agent_name, config.agents[agent_name]));

    const channel = (packet) => {
        agents.forEach((agent) => agent.dispatch(packet));
    };

    // Hooks
    const hooks = Object.keys(config.hooks)
        .map((hook_name) => {
            console.log('Setting hook', hook_name, config.hooks[hook_name]);
            const hook = config.hooks[hook_name].with(hook_name);
            hook.init.call(hook, config.hooks[hook_name].dependencies);
            hook.on(Events.HOOK_EVENT, channel);
            return hook;
        });

    console.log(agents, hooks)
}

/* Exports -------------------------------------------------------------------*/

module.exports = { 
    monitor, 
    hooks: Hooks,
    agents: Agents
};