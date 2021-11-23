#!/usr/bin/env node
'use strict';

require('dotenv').config();
const query = require('./caching/api-query');

(async () => {
    const request = {
        near: 'Houston, TX',
        chains: 'ab4b4810-d68a-012e-5619-003048cad9da',
        limit: 50
    };
    const results = await query(request, 1000 * 60);
    console.log(results.length);
    process.exit()
})()
