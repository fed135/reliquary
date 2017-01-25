/**
 * Express hooks
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const crypto = require('crypto');

const Hook = require('./Hook');
const Events = require('../Events');

/* Methods -------------------------------------------------------------------*/

class ExpressHook extends Hook {
    constructor(app) {
        super();
        
        // Hijacks some express internals
        // Works for Express v4 and up
        const _handle = app.handle.bind(app);
        app.handle = (req, res) => {
            const reqId = crypto.randomBytes(20).toString('hex');
            this.emit(Events.HOOK_EVENT, {
                uri: req.url,
                method: req.method,
                evt: 'incomming',
                timestamp: Date.now(),
                reqId,
                hook: this.name
            });
            res.on('finish', (evt) => {
                this.emit(Events.HOOK_EVENT, {
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    evt: 'finish',
                    timestamp: Date.now(),
                    reqId,
                    hook: this.name
                });
            });
            _handle(req, res);
        };
    }
};

/* Exports -------------------------------------------------------------------*/

// TODO: Ugly closure to revise (had trouble with composition scoping)
module.exports = function create(app) {
    return new ExpressHook(app);
};