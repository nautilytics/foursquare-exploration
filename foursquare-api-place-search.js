#!/usr/bin/env node
'use strict';

require('dotenv').config();
const query = require('./caching/api-query');

const TARGET_CHAIN_ID = 'ab4b8230-d68a-012e-5619-003048cad9da';

(async () => {
    const data = {};
    const stores = [
        'Target'
    ];
    const cities = [
        {name: 'Houston, TX', region: 'US.TX.RR'},
    ]
    for (let metroCity of cities) {
        const {name: cityName} = metroCity;
        data[cityName] = [];
        for (let store of stores) {
            const request = {
                near: cityName,
                chains: TARGET_CHAIN_ID,
                limit: 50
            };
            const results = await query(request, 1000 * 60 * 60);
            console.log(results);
        }
    }
    process.exit()
})()
