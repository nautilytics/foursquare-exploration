#!/usr/bin/env node
'use strict';

require('dotenv').config();
const fs = require('fs');
const {to} = require("await-to-js");
const rp = require("request-promise");

(async () => {
    const data = [];
    const stores = [
        'Target',
        'Walmart'
    ];
    const cities = [
        {
            name: 'Houston, TX', region: 'US.TX.RR',
            tags: [
                {store: 'Target', tag: 'us-houston-food-stores-target'},
                {store: 'Walmart', tag: 'us-houston-food-stores-walmart'},
            ]
        },
        {
            name: 'Atlanta, GA', region: 'US.GA.FU',
            tags: [
                {store: 'Target', tag: 'us-atlanta-food-stores-target'},
                {store: 'Walmart', tag: 'us-atlanta-food-stores-walmart'},
            ]
        },
        {
            name: 'Dallas, TX', region: 'US.TX.DS',
            tags: [
                {store: 'Target', tag: 'us-dallas-ftw-food-stores-target'},
                {store: 'Walmart', tag: 'us-dallas-ftw-food-stores-walmart'},
            ]
        },
        {
            name: 'Detroit, MI', region: 'US.MI.WY', tags: [
                {store: 'Target', tag: 'us-detroit-food-stores-target'},
                {store: 'Walmart', tag: 'us-detroit-food-stores-walmart'},
            ]
        },
        {
            name: 'Chicago, IL', region: 'US.IL.CO', tags: [
                {store: 'Target', tag: 'us-chicago-food-stores-target'},
                {store: 'Walmart', tag: 'us-chicago-food-stores-walmart'},
            ]
        },
        {
            name: 'Boston, MA', region: 'US.MA.SU', tags: [
                {store: 'Target', tag: 'us-boston-food-stores-target'},
                {store: 'Walmart', tag: 'us-boston-food-stores-walmart'},
            ]
        },
        {
            name: 'Miami, FL', region: 'US.FL.DA',
            tags: [
                {store: 'Target', tag: 'us-miami-food-stores-target'},
                {store: 'Walmart', tag: 'us-miami-food-stores-walmart'},
            ]
        },
        {
            name: 'Philadelphia, PA', region: 'US.PA.PH',
            tags: [
                {store: 'Target', tag: 'us-philadelphia-food-stores-target'},
                {store: 'Walmart', tag: 'us-philadelphia-food-stores-walmart'},
            ]
        },
        {
            name: 'Phoenix, AZ', region: 'US.AZ.MA',
            tags: [
                {store: 'Target', tag: 'us-phoenix-food-stores-target'},
                {store: 'Walmart', tag: 'us-phoenix-food-stores-walmart'},
            ]
        },
        {
            name: 'New York, NY', region: 'US.NY.NE',
            tags: [
                {store: 'Target', tag: 'us-nyc-food-stores-target'},
                {store: 'Walmart', tag: 'us-nyc-food-stores-walmart'},
            ]
        },
        {
            name: 'Los Angeles, CA', region: 'US.CA.LO',
            tags: [
                {store: 'Target', tag: 'us-la-food-stores-target'},
                {store: 'Walmart', tag: 'us-la-food-stores-walmart'},
            ]
        },
        {
            name: 'Seattle, WA', region: 'US.WA.KN',
            tags: [
                {store: 'Target', tag: 'us-seattle-food-stores-target'},
                {store: 'Walmart', tag: 'us-seattle-food-stores-walmart'},
            ]
        },
        {
            name: 'San Francisco, CA', region: 'US.CA.SF',
            tags: [
                {store: 'Target', tag: 'us-sf-food-stores-target'},
                {store: 'Walmart', tag: 'us-sf-food-stores-walmart'},
            ]
        }
    ]
    for (let metroCity of cities) {
        const {name: cityName, region, tags} = metroCity;
        const locations = [];
        for (let store of stores) {

            // Get an existing route tag or create a new one
            const routeTag = tags.find(d => d.store === store);

            // Get feature collection from Location Service
            const [err, result] = await to(rp({
                uri: `https://cloud.dev.premise.com/api/webProxy/v2/route/${routeTag.tag}/features?onlyActive=true`,
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${process.env.BEARER_TOKEN}`
                },
                json: true
            }));
            if (err) {
                console.error(err);
                process.exit();
            }

            // Save as a GeoJSON file to see where all the locations are - upload to a GIST
            locations.push({
                storeName: store,
                featureCollection: {
                    type: "FeatureCollection",
                    features: result.collection.features
                }
            });
        }
        data.push({city: cityName, region, locations})
    }
    fs.writeFileSync(`./data/store-locations.json`, JSON.stringify(data));
    process.exit()
})()
