#!/usr/bin/env node
'use strict';

require('dotenv').config();
const query = require('./caching/api-query');
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');

(async () => {
    const cities = [
        'Houston, TX', 'Dallas, TX',
        'Detroit, MI', 'Boston, MA',
        'New York, NY', 'Los Angeles, CA',
        'Seattle, WA', 'San Francisco, CA',
        'San Diego, CA'
    ]
    for(let city of cities) {
        const request = {
            near: city,
            v: '20210817',
            query: 'Target',
            client_id: process.env.FOURSQUARE_CLIENT_ID,
            client_secret: process.env.FOURSQUARE_CLIENT_SECRET
        };
        const results = await query(request, 1000 * 60 * 60);
        const venues = results.response.venues;

        // Save as a GeoJSON file to see where all the locations are - upload to a GIST
        const features = venues.map(venue => {
            const {lat, lng, address, city, state, postalCode} = venue.location;
            return {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat],
                    "properties": {
                        address,
                        city,
                        state,
                        postalCode,
                        name: venue.name
                    }
                }
            }
        })
        console.info(`Starting writing ${city} to GeoJSON`);
        fs.writeFileSync(`./data/${kebabCase(city)}-target.geojson`, JSON.stringify({
            "type": "FeatureCollection",
            features
        }));
    }
    process.exit()
})()
