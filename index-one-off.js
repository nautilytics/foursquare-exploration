#!/usr/bin/env node
'use strict';

require('dotenv').config();
const query = require('./caching/api-query');
const fs = require('fs');

const RESIDENTIAL_CONDO_CATEGORY_ID = '4d954b06a243a5684965b473';

(async () => {
    const request = {
        near: 'San Diego, CA',
        v: '20210817',
        categoryId: RESIDENTIAL_CONDO_CATEGORY_ID,
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET
    };
    const results = await query(request, 1000 * 60 * 60);
    const venues = results.response.venues;
    fs.writeFileSync(`./data/residential-condo-locations.json`, JSON.stringify(venues));
    process.exit()
})()
