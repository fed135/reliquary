/** 
 * Reliquary Entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Pool = require('./src/Pool');

/* Methods -------------------------------------------------------------------*/

function start() {
    // 1- Load config/ENV variables
    // 2- Spawn agents
    // 3- Dissapear


    // Agent spawn test
    Pool.spawn();
}

/* Exports -------------------------------------------------------------------*/

module.exports = { start };