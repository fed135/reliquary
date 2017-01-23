/**
 * Hook super class
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;

/* Methods -------------------------------------------------------------------*/

class Hook extends EventEmitter {
    constructor() {
        super();
        
        this.name = 'no-name';
    }

    setName(name) {
        this.name = name;
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = Hook;