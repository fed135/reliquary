/**
 * Agent logic
 * Sends events to Newrelic server
 */

'use strict';

/* Init ----------------------------------------------------------------------*/

process.title = 'reliquary-agent';

process.on('message', (evt) => {
    // Make the actual network call- implement circuit breaker if needed- 
    // in the case of a 4XX or 5XX error, it's maybe a good idea to kill this process

    // Once a packet has made it safely to Newrelic, send all the successfully sent packets back to the main thread
    process.send(evt);
});