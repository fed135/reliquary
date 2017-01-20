/**
 * Express hooks
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const EventEmitter = require('events').EventEmitter;
const crypto = require('crypto');

const Events = require('../Events');

/* Methods -------------------------------------------------------------------*/

function create(hook) {
    return Object.assign({
        // Hijacks some express internals
        // Works for Express v4 and up
        init: (app) => {
            console.log(arguments)
            const _handle = app.handle.bind(app);
            app.handle = (req, res) => {
                const reqId = crypto.randomBytes(20).toString('hex');
                this.emit(Events.HOOK_EVENT, {
                    uri: req.url,
                    method: req.method,
                    evt: 'incomming',
                    timestamp: Date.now(),
                    reqId,
                    hook
                });
                res.on('finish', (evt) => {
                    this.emit(Events.HOOK_EVENT, {
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        evt: 'finish',
                        timestamp: Date.now(),
                        reqId,
                        hook
                    });
                });
                _handle(req, res);
            };
        }
    },
    EventEmitter.prototype);
};

/* Exports -------------------------------------------------------------------*/

module.exports = create;