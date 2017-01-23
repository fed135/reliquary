# Reliquary

A very lightweight and modular monitoring solution.

## Basic setup

Starting Reliquary is done explicitely in the entry point of your application.

You need to plug in your **hooks** what collects data 

and your **agents**, where that data goes.

```
/* Requires ------------------------------------------------------------------*/

const reliquary = require('reliquary');
const express = require('express');

/* Init ----------------------------------------------------------------------*/

const app = express();

reliquary.monitor({
  hooks: {
    my_app: new reliquary.hooks.Express(app),
    sys: new reliquary.hooks.Sys()
  },
  agents: {
    newrelic: {
      token: 'abc'
    }
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

Right now, newrelic is the only supported agent. ...Until I figure out a clean way to pass a module url to be forked via config.

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