/** 
 * Reliquary Entry point
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const dgram = require('dgram');
const http = require('http');
const os = require('os');

const Events = require('./src/Events');
const Pool = require('./src/Pool');
const ExpressHook = require('./src/hooks/Express');
const NetHook = require('./src/hooks/Net');
const UDPHook = require('./src/hooks/UDP');
const HTTPHook = require('./src/hooks/HTTP');
const SysHook = require('./src/hooks/Sys');

/* Methods -------------------------------------------------------------------*/

function monitor(app, hooks) {
    // TODO: Load config/ENV variables

    // Carrier
    const carrier = new Pool('carrier');
    const channel = carrier.dispatch.bind(carrier);

    // Express Hook
    const express_hook = new ExpressHook(app);
    express_hook.on(Events.EXPRESS_HANDLE, channel);
    express_hook.on(Events.EXPRESS_FINISH, channel);

    const analyser = analyse.bind(null, hooks, channel);

    // Net Hook
    // const net_hook = new NetHook(net);
    // net_hook.on(Events.NET_SEND, analyser);
    // net_hook.on(Events.NET_DATA, analyser);

    // UDP Hook
    // const net_hook = new UDPHook(dgram);
    // udp_hook.on(Events.UDP_SEND, analyser);
    // udp_hook.on(Events.UDP_DATA, analyser);

    // HTTP Hook
    // const http_hook = new HTTPHook(http);
    // http_hook.on(Events.HTTP_SEND, analyser);
    // http_hook.on(Events.HTTP_DATA, analyser);

    // Proc monitor
    const proc_hook = new SysHook(process, os);
    proc_hook.on(Events.PROC_MONIT, channel);
}

function analyse(hooks, channel, packet) {
    if ((hooks || []).includes(packet.source)) channel(packet);
}

/* Exports -------------------------------------------------------------------*/

module.exports = { monitor };