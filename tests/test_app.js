/**
 * Test app
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const reliquary = require('../');

const express = require('express');

/* Init ----------------------------------------------------------------------*/

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function (ett) {
  reliquary.monitor(app);
  console.log('Example app listening on port 3000!')
})