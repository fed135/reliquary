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

        this.bbtime = Date.now();
        this.probe_count = 0;
        this.monitor = this.probe.bind(this, proc || process, os || require('os'));
        this.timer = setTimeout(this.monitor, 0);
    }

    probe(proc, os) {
        const now = Date.now();
        this.probe_count++;
        const next_probe = this.bbtime + (PROBE_FREQ * this.probe_count);
        this.timer = setTimeout(
            this.monitor,
            Math.max(0, next_probe - now)
        );

        this.emit(Events.HOOK_EVENT, {
            timestamp: now,
            mem: proc.memoryUsage().rss,
            cpu: os.loadavg()[0],
            hook: this.name
        });
    }
}

/* Exports -------------------------------------------------------------------*/

// TODO: Ugly closure to revise (had trouble with composition scoping)
module.exports = function create(proc, os) {
    return new SysHook(proc, os);
};