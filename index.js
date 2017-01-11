/** 
 * Reliquary Entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Events = require('./src/Events');
const Pool = require('./src/Pool');
const ExpressHook = require('./src/ExpressHook');

/* Methods -------------------------------------------------------------------*/

function monitor(app) {
    // 1- Load config/ENV variables
    // 2- Hook to Express app (arg)
    // 3- (Optionnal) monitor process' hardware usage

    // Express Hook test
    const hooks = new ExpressHook(app);
    hooks.on(Events.EXPRESS_PARAM, console.log);
    hooks.on(Events.EXPRESS_PROCESS, console.log);
    hooks.on(Events.EXPRESS_RENDER, console.log);
    hooks.on(Events.EXPRESS_ROUTE, console.log);
    hooks.on(Events.EXPRESS_USE, console.log);

    // Carrier test
    const carrier = new Pool('carrier');
    carrier.dispatch({test: 'FOO'});
}

/* Exports -------------------------------------------------------------------*/

module.exports = { monitor };