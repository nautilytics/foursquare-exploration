#!/usr/bin/env node
'use strict';

require('dotenv').config();
const fs = require('fs');
const {to} = require("await-to-js");
const query = require('./caching/web-proxy-query');
const apiQuery = require('./caching/api-query');
const kebabCase = require("lodash.kebabcase");
const {pointsWithinPolygon, point} = require('@turf/turf');

const BIG_BOX_STORE_CATEGORY_ID = '52f2ab2ebcbc57f1066b8b42';
const GROCERY_STORE_CATEGORY_ID = '4bf58dd8d48988d118951735';

(async () => {
    const data = [];
    // TODO - update icon links for ALDI, et al
    const stores = [
        {
            name: 'Target',
            imageUrl: '/api/images/template-poc/icon-brand-target.png',
            category: BIG_BOX_STORE_CATEGORY_ID
        },
        {
            name: 'Walmart',
            imageUrl: '/api/images/template-poc/icon-brand-walmart.png',
            category: BIG_BOX_STORE_CATEGORY_ID
        },
        {
            name: 'ALDI',
            imageUrl: '/api/images/template-poc/icon-brand-walmart.png',
            category: GROCERY_STORE_CATEGORY_ID
        },
        {name: 'Walgreens', imageUrl: '/api/images/template-poc/icon-brand-walmart.png'},
        {name: 'Kroger', imageUrl: '/api/images/template-poc/icon-brand-walmart.png'},
    ];
    const cities = [
        {
            name: 'Houston, TX', region: 'US.TX.RR',
            tags: [
                {store: 'Target', tag: 'us-houston-food-stores-target'},
                {store: 'Walmart', tag: 'us-houston-food-stores-walmart'}
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
    ].map(city => ({
        ...city,
        tags: city.tags.concat([
            {store: 'ALDI'},
            {store: 'Walgreens'},
            {store: 'Kroger'},
        ])
    }));
    for (let metroCity of cities.slice(0, 1)) {
        const {name: cityName, region, tags} = metroCity;
        const locations = [];

        // Get the GeoJSON for the region
        const [err, result] = await to(query(
            `${process.env.WEB_PROXY_PROD_URL}/regions/${region}`,
            {geojson: true},
            process.env.BEARER_TOKEN_PROD,
            1000 * 60 * 60
        ));
        if (err) {
            console.error(err);
            process.exit();
        }

        // Only keep the multi-polygon geometry
        const regionGeometry = JSON.parse(result.geometry);

        for (let store of stores.slice(2, 5)) {

            // Get an existing route tag or create a new one
            const routeTag = tags.find(d => d.store === store.name);

            // Retrieve route tag from Ops Console
            let features = [];
            let tag;
            if (routeTag?.tag) {

                // Get feature collection from Location Service
                const [err, result] = await to(query(
                    `${process.env.WEB_PROXY_PROD_URL}/route/${routeTag.tag}/features`,
                    {onlyActive: true},
                    process.env.BEARER_TOKEN_PROD,
                    1000 * 60 * 60
                ));
                if (err) {
                    console.error(err);
                    process.exit();
                }

                // Store the locations for use in Portal
                tag = result.collection.features[0].properties.tags[0];
                features = result.collection.features.map(d => {
                    let geometry = {
                        type: 'Point',
                        coordinates: [
                            d.geometry.coordinates[0][0],
                            d.geometry.coordinates[0][1],
                        ]
                    };
                    const {name} = d.properties;
                    return {
                        geometry,
                        properties: {
                            name
                        },
                        type: "Feature"
                    };
                })

            } else {  // Create a new route tag based on FourSquare data
                const request = {
                    near: cityName,
                    v: '20210817',
                    query: store.name,
                    ...(store.category ? store.category : {}),
                    client_id: process.env.FOURSQUARE_CLIENT_ID,
                    client_secret: process.env.FOURSQUARE_CLIENT_SECRET
                };
                const results = await apiQuery(request, 1000 * 60 * 60);
                console.log(results);
                const venues = results.response.venues;
                console.log(`${store.name} in ${cityName} venues: ${venues.length}`);

                // Only keep those venues that fall within the region boundary
                const filteredVenues = venues.filter(venue => {
                    const {location} = venue;
                    const {lat, lng} = location;
                    const venuePoint = point([lng, lat]);
                    return pointsWithinPolygon(venuePoint, regionGeometry);
                })
                console.log(`${store.name} in ${cityName} filtered venues: ${filteredVenues.length}`);

                if (filteredVenues.length) {
                    // Create a new route tag in dev, QA, and Prod
                    const tag = `us-${kebabCase(cityName)}-metro-food-stores-${store.name.toLowerCase()}s`;

                    // TODO - write to dev, QA, and Prod
                }
            }

            // locations.push({
            //     storeName: store.name,
            //     storeImageUrl: store.imageUrl,
            //     routeTag: tag,
            //     featureCollection: {
            //         type: "FeatureCollection",
            //         features
            //     }
            // });
        }
        //data.push({city: cityName, region, locations})
    }
    //fs.writeFileSync(`./data/store-locations.json`, JSON.stringify(data));
    process.exit()
})()
