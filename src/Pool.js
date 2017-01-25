/**
 * Pool class
 * A singleton that manages Agents
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Events = require('./Events');

const fork = require('child_process').fork;
const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

/* Methods -------------------------------------------------------------------*/

class Pool extends EventEmitter {
    constructor(role, options) {
        super();

        this.options = Object.assign({ role }, options);
        this.last_attempt = 0;
        this.agent = null;
        this.queue = [];

        this.on(Events.AGENT_CREATED, this.process_queue.bind(this));
    }

    spawn() {
        this.agent = fork(this.options.role);
        this.agent.send(['CON', this.options]);
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

            this.agent.send(['PKT', this.queue
                .filter((packet) => {
                    const to_send = packet.agent !== current_agent;
                    packet.agent = current_agent;
                    return to_send;
                })
            ]);
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
            this.agent.send(['PKT', [packet]]);
        }
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = Pool;