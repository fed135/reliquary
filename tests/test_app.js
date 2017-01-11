/**
 * Test app
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const reliquary = require('../');

const express = require('express');

/* Init ----------------------------------------------------------------------*/

const app = express();
reliquary.monitor(app);

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})