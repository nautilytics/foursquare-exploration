#!/usr/bin/env node
'use strict';

require('dotenv').config();
const query = require('./caching/api-query');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');

const TARGET_CHAIN_ID = '556e119fa7c82e6b725012dd';
const WALMART_CHAIN_ID = '556f676fbd6a75a99038d8e6';
const BIG_BOX_STORE_CATEGORY_ID = '52f2ab2ebcbc57f1066b8b42';

(async () => {
    const data = {};
    const stores = [
        'Target',
        'Walmart'
    ];
    const cities = [
        {name: 'Houston, TX', region: 'US.TX.RR'},
        {name: 'Dallas, TX', region: 'US.TX.DS'},
        {name: 'Detroit, MI', region: 'US.MI.WY'},
        {name: 'Chicago, IL', region: 'US.IL.CO'},
        {name: 'Boston, MA', region: 'US.MA.SU'},
        {name: 'New York, NY', region: 'US.NY.NE'},
        {name: 'Los Angeles, CA', region: 'US.CA.LO'},
        {name: 'Seattle, WA', region: 'US.WA.KN'},
        {name: 'San Francisco, CA', region: 'US.CA.SF'},
        {name: 'San Diego, CA', region: 'US.CA.SD'}
    ]
    const existingRouteTags = [
        {store: 'Target', city: 'Los Angeles, CA', tag: 'us-la-food-stores-target'},
        {store: 'Walmart', city: 'Los Angeles, CA', tag: 'us-la-food-stores-walmart'},
    ]
    for (let store of stores) {
        data[store] = [];
        for (let metroCity of cities) {
            const {name: cityName, region} = metroCity;
            const request = {
                near: cityName,
                v: '20210817',
                query: store,
                categoryId: BIG_BOX_STORE_CATEGORY_ID,
                client_id: process.env.FOURSQUARE_CLIENT_ID,
                client_secret: process.env.FOURSQUARE_CLIENT_SECRET
            };
            const results = await query(request, 1000 * 60 * 60);
            const venues = results.response.venues;

            // Get an existing route tag or create a new one
            const routeTag = existingRouteTags.find(d => d.store === store && d.city === cityName)
                ?? {tag: `${kebabCase(cityName)}-metro-${store.toLowerCase()}s`};

            // Save as a GeoJSON file to see where all the locations are - upload to a GIST
            const featureCollectionOfLineStrings = {
                type: "FeatureCollection",
                features: venues.map(venue => {
                    const {lat, lng, address, city, state, postalCode} = venue.location;
                    return {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: [
                                [Number(lng), Number(lat)],
                                [Number(lng), Number(lat)],
                            ]
                        },
                        properties: {
                            dataset: 'route',
                            status: 'ACTIVE',
                            tags: [routeTag.tag],
                            address,
                            city,
                            state,
                            postalCode,
                            name: venue.name
                        }
                    }
                })
            }
            data[store].push({
                city: cityName,
                featureCollection: {
                    type: "FeatureCollection",
                    features: venues.map(venue => {
                        const {lat, lng, address, city, state, postalCode} = venue.location;
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [Number(lng), Number(lat)]
                            },
                            properties: {
                                address,
                                city,
                                state,
                                postalCode,
                                routeTag: routeTag.tag,
                                name: venue.name,
                                region
                            }
                        }
                    })
                }
            });
            console.info(`Starting writing ${store} ${cityName} to GeoJSON`);
            fs.writeFileSync(
                `./data/${kebabCase(cityName)}-${store.toLowerCase()}.geojson`,
                JSON.stringify(featureCollectionOfLineStrings)
            );
        }
    }
    fs.writeFileSync(`./data/store-locations.json`, JSON.stringify(data));
    process.exit()
})()
