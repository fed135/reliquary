/**
 * Pool class
 * A singleton that manages Agents
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Events = require('./Events');

const child_process = require('child_process');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const crypto = require('crypto');

/* Methods -------------------------------------------------------------------*/

class Pool extends EventEmitter {
    constructor(options) {
        super();

        this.options = Object.assign({}, options);
        this.last_attempt = 0;
        this.agent = null;
        this.queue = [];

        this.on(Events.AGENT_CREATED, this.process_queue.bind(this));
    }

    spawn() {
        this.agent = child_process.fork(path.join(__dirname,'entities/agent'));
        this.emit(Events.AGENT_CREATED, this.agent);
        this.agent.on('message', this.handle_submitted.bind(this));
        this.agent.on('close', this.recover.bind(this));
    }

    recover() {
        const respawn_delay = this.options.respawn_delay || 1000;
        if (Date.now() - this.last_attempt >= respawn_delay) this.spawn();
    }

    process_queue() {
        if (this.queue.length > 0) {
            const current_agent = this.agent.pid;

            this.agent.send(this.queue
                .filter((packet) => {
                    const to_send = packet.agent !== current_agent;
                    packet.agent = current_agent;
                    return to_send;
                })
            );
        }
    }

    handle_submitted(packets) {
        for (let queued = this.queue.length - 1; queued >= 0; queued--) {
            for (let sent = packets.length - 1; sent >= 0; sent--) {
                if (this.queue[queued].id === packets[sent].id) {
                    this.queue.splice(queued, 1);
                    break;
                }
            }
        }
    }

    dispatch(event) {
        const packet = { 
            event, 
            id: crypto.randomBytes(20).toString('hex'),
            agent: null
        };

        this.queue.push(packet);
        if (this.agent === null) this.recover();
        else {
            packet.agent = this.agent.pid;
            this.agent.send([packet]);
        }
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = new Pool();