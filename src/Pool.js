/**
 * Pool class
 * Manages Agents
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Events = require('./Events');

const child_process = require('child_process');
const EventEmitter = require('events').EventEmitter;
const path = require('path');

/* Methods -------------------------------------------------------------------*/

class Pool extends EventEmitter {
    constructor() {
        super();

        this.agents = [];
    }

    spawn() {
        let agent = child_process.fork(path.join(__dirname,'entities/agent'));
        this.agents.push(agent);
        this.emit(Events.AGENT_CREATED, agent);
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Pool();