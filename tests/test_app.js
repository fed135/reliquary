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
    express: new reliquary.hooks.Express(app),
    sys: new reliquary.hooks.Sys(process, require('os'))
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