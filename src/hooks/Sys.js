/**
 * Process perf analysis (using only V8 introspection)
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Hook = require('./Hook');
const Events = require('../Events');

/* Local variables -----------------------------------------------------------*/

const PROBE_FREQ = 1000 * 60;

/* Methods -------------------------------------------------------------------*/ 

class SysHook extends Hook {
    constructor(proc, os) {
        super();
        
        this.monitor = this.probe.bind(this, proc || process, os || require('os'));
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

        this.emit(Events.HOOK_EVENT, {
            timestamp: now,
            mem: proc.memoryUsage().rss,
            cpu: os.loadavg()[0],
            hook: 'sys'
        });
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = SysHook;