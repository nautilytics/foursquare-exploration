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
        'Houston, TX',
        'Dallas, TX',
        'Detroit, MI',
        'Boston, MA',
        'New York, NY',
        'Los Angeles, CA',
        'Seattle, WA',
        'San Francisco, CA',
        'San Diego, CA'
    ]
    for (let store of stores) {
        data[store] = [];
        for (let metroCity of cities) {
            const request = {
                near: metroCity,
                v: '20210817',
                query: store,
                categoryId: BIG_BOX_STORE_CATEGORY_ID,
                client_id: process.env.FOURSQUARE_CLIENT_ID,
                client_secret: process.env.FOURSQUARE_CLIENT_SECRET
            };
            const results = await query(request, 1000 * 60 * 60);
            const venues = results.response.venues;

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
                            tags: [
                                `${kebabCase(metroCity)}-metro-${store.toLowerCase()}s`
                            ],
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
                city: metroCity,
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
                                routeTag: `${kebabCase(metroCity)}-metro-${store.toLowerCase()}s`,
                                name: venue.name
                            }
                        }
                    })
                }
            });
            console.info(`Starting writing ${store} ${metroCity} to GeoJSON`);
            fs.writeFileSync(
                `./data/${kebabCase(metroCity)}-${store.toLowerCase()}.geojson`,
                JSON.stringify(featureCollectionOfLineStrings)
            );
        }
    }
    fs.writeFileSync(`./data/store-locations.json`, JSON.stringify(data));
    process.exit()
})()
