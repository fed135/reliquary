/**
 * Express hooks
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Events = require('./Events');

const EventEmitter = require('events').EventEmitter;

/* Methods -------------------------------------------------------------------*/

class ExpressHook extends EventEmitter {
    constructor(app) {
        super();

        // Hijacks some express internals
        // Works for Express v4 and up
        
        const _render = app.render.bind(app);
        app.render = (one, two, three, four) => {
            this.emit(Events.EXPRESS_RENDER, [one, two, three, four]);
            _render(...arguments);
        };
    }
}

/* Exports -------------------------------------------------------------------*/

module.exports = ExpressHook;