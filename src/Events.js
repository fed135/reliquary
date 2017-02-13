/**
 * Static Event collection
 */

'use strict';

/* Exports -------------------------------------------------------------------*/

module.exports = {
    AGENT_CREATED: 'agentCreated',
    HOOK_EVENT: 'hookEvent',

    CONFIG: (params) => { return { e: 'config', d: params }},
    PACKETS: (params) => { return { e: 'packets', d: params }},
};