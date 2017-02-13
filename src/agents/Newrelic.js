/**
 * Agent logic
 * Sends events to Newrelic server
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const http = require('http');

/* Local variables -----------------------------------------------------------*/

let config = null;

/* Methods -------------------------------------------------------------------*/

function init(config) {
    config = config;
    process.title = `reliquary-${config.role}-agent`;
}

function trigger(packets) {
    // Make the actual network call- implement circuit breaker if needed- 
    // in the case of a 4XX or 5XX error, it's maybe a good idea to kill this process
    console.log('SENDING', packets);

    // Once a packet has made it safely to Newrelic, send all the successfully sent packets back to the main thread
    process.send(packets);
}

/* Init ----------------------------------------------------------------------*/

process.on('message', (evt) => {
    const handler = evt.e === 'config'? init:trigger;
    handler(evt.d);
});