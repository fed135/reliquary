/**
 * Process perf analysis (using only V8 introspection)
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;

const Events = require('../Events');

/* Local variables -----------------------------------------------------------*/

const PROBE_FREQ = 1000 * 60;

/* Methods -------------------------------------------------------------------*/ 

class SysHook extends EventEmitter {
    constructor(proc, os) {
        super();

        this.last_probe = Date.now();
        this.monitor = this.probe.bind(this, proc, os);
        this.timer = setTimeout(this.monitor, 0);
    }

    probe(proc, os) {
        const now = Date.now();
        const diff = now - this.last_probe;
        this.last_probe = now;
        this.timer = setTimeout(
            this.monitor,
            Math.max(0, PROBE_FREQ + (PROBE_FREQ - diff))
        );

        this.emit(Events.PROC_MONIT, {
            timestamp: now,
            mem: proc.memoryUsage().rss,
            cpu: os.loadavg()[0]
        });
    }
}


/* Exports -------------------------------------------------------------------*/

module.exports = SysHook;