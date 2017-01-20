/**
 * Express hooks
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const Events = require('../Events');

/* Methods -------------------------------------------------------------------*/

class ExpressHook extends EventEmitter {
    constructor(app) {
        super();

        // Hijacks some express internals
        // Works for Express v4 and up
        
        const _handle = app.handle.bind(app);
        app.handle = (req, res) => {
            const reqId = crypto.randomBytes(20).toString('hex');
            this.emit(Events.EXPRESS_HANDLE, {
                uri: req.url,
                method: req.method,
                evt: Events.EXPRESS_HANDLE,
                timestamp: Date.now(),
                reqId
            });
            res.on('finish', (evt) => {
                this.emit(Events.EXPRESS_FINISH, {
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    evt: Events.EXPRESS_FINISH,
                    timestamp: Date.now(),
                    reqId
                });
            });
            _handle(req, res);
        };
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = ExpressHook;