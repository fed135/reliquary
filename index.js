/** 
 * Reliquary Entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Pool = require('./src/Pool');

/* Methods -------------------------------------------------------------------*/

function monitor(app) {
    // 1- Load config/ENV variables
    // 2- Hook to Express app (arg)
    // 3- (Optionnal) monitor process' hardware usage


    // Dispatch test
    Pool.dispatch({test: 'FOO'});
}

/* Exports -------------------------------------------------------------------*/

module.exports = { monitor };