/**
 * Test app
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const reliquary = require('../');

const express = require('express');

/* Init ----------------------------------------------------------------------*/

const app = express();

reliquary.monitor({
  hooks: {
    express: reliquary.hooks.Express(app),
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