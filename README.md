# Reliquary

A very lightweight and modular monitoring solution.

*No dependencies required!*

[![Reliquary](https://img.shields.io/npm/v/reliquary.svg)](https://www.npmjs.com/package/reliquary)
[![Build Status](https://travis-ci.org/fed135/reliquary.svg?branch=master)](https://travis-ci.org/fed135/reliquary)


## About

Reliquary is a drop in solution for API monitoring. It is meant to be as lightweight and as unintrucive as possible.

Currently, most commercial Node clients are bulky, unoptimized and actually impact the performances of your application.

This library has **no dependencies** for the fastest possible install, treats messages in seperate forks to keep 
the main process running at top speed and is fully modular so that you can load your own hooks and agents easily!


## Basic setup

Starting Reliquary is done explicitely in the entry point of your application.

You need to plug in your **hooks** (what collects data)

And your **agents** (where the data should go).

```
/* Requires ------------------------------------------------------------------*/

const reliquary = require('reliquary');
const express = require('express');

/* Init ----------------------------------------------------------------------*/

const app = express();

reliquary.monitor({
  hooks: {
    my_app: reliquary.hooks.Express(app),
    sys: reliquary.hooks.Sys()
  },
  agents: {
    newrelic: reliquary.agents.NewRelic({ token: 'abc' })
  }
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function (ett) {
  console.log('Example app listening on port 3000!')
})
```

In this example, we set up a hook that we named after our application and that monitors express traffic.

We also set up a hook to collect process performance metrics that we named **sys**. Note that you can pass this hook a reference to the process you want to monitor.

Finally, we set up our Newrelic agent, which is the entity that will be talking to the newrelic API, with our configuration. 


## Hooks

Right now, **Express** and **Sys** are the only 2 hooks that ship with reliquary, but it is possible to load your own.

A hook simply needs to extend `Hook` and emit `HOOK_EVENT`.

These events will be funnelled to agents.


## Agents

Right now, newrelic is the only built-in agent. To load your own, just pass a 'role' property to the options with the absolute path to the agent module. 
Ex:

```
agents: {
    google_analytics: { name: 'Google Analytics', role: path.join(__dirname, 'ga'), token: 'abc' }
}
```

An agent receives process events `[EVT, [messages, ...]]`. 

Once a message is treated, the process needs to report back to the reliquary agent Pool with the id of that message, so it can be marked as processed. 
Otherwise, the message will be processed again after it's timeout during the next cycle.


## Installing

Compatible with Node v4+

`npm install reliquary --save`


## Disabling

You can disable or re-enable reliquary globaly at any given time in your application.

```
const reliquary = require('reliquary');
reliquary.enable(false); // Disables reporting
reliquary.enable(true); // Restores reporting
```