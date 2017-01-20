/**
 * Agent logic
 * Sends events to Newrelic server
 */

'use strict';

/* Local variables -----------------------------------------------------------*/

let config = null;

/* Init ----------------------------------------------------------------------*/

process.on('message', (evt) => {
    if (evt[0] === 'CON') {
        config = evt[1];
        process.title = `reliquary-${config.role}-agent`;
    }
    else {
        // Make the actual network call- implement circuit breaker if needed- 
        // in the case of a 4XX or 5XX error, it's maybe a good idea to kill this process
        console.log('SENDING', evt[1]);

        // Once a packet has made it safely to Newrelic, send all the successfully sent packets back to the main thread
        process.send(evt);
    }
});