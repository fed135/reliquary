/**
 * Agent list
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const path = require('path');

/* Methods -------------------------------------------------------------------*/

function buildAgent(name, options) {
    return Object.assign({ 
        name, 
        role: path.join(__dirname, name)
    }, options);
}

/* Exports -------------------------------------------------------------------*/

module.exports = { 
    NewRelic: buildAgent.bind(null, 'Newrelic')
};