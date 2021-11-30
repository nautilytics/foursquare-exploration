#!/usr/bin/env node
'use strict';

require('dotenv').config();
const fs = require('fs');
const {to} = require("await-to-js");
const query = require('./caching/web-proxy-query');
const apiQuery = require('./caching/api-query');
const kebabCase = require("lodash.kebabcase");
const {booleanPointInPolygon, point} = require('@turf/turf');
const {stores, cities, environmentLookup} = require('./constants');
const {createTag, addFeature, getFeature, getFeatureForPortal, getFeatureFromRouteTag} = require('./utils');

(async () => {
    const data = [];
    for (let metroCity of cities) {
        const {name: cityName, region, tags} = metroCity;
        console.info(`Working on ${cityName}`);
        const locations = [];

        // Get the GeoJSON for the region
        const [err, result] = await to(query(
            `${process.env.WEB_PROXY_PROD_URL}/regions/${region}`,
            {
                geojson: true
            },
            process.env.BEARER_TOKEN_PROD,
            1000 * 60 * 60 * 24 * 7
        ));
        if (err) {
            console.error(err);
            process.exit();
        }

        // Only keep the multi-polygon geometry
        const regionGeometry = JSON.parse(result.geometry);

        for (let store of stores) {

            console.info(`Working on ${store.name}`);

            // Get an existing route tag or create a new one
            const routeTag = tags.find(d => d.store === store.name);

            // Retrieve route tag from Ops Console
            let features = [];
            let tag;
            if (routeTag?.tag) {

                // Get feature collection from Location Service
                console.info(`Tag ${routeTag.tag} exists, so re-using`);
                const [err, result] = await to(query(
                    `${process.env.WEB_PROXY_PROD_URL}/route/${routeTag.tag}/features`,
                    {
                        onlyActive: true
                    },
                    process.env.BEARER_TOKEN_PROD,
                    1000 * 60 * 60 * 24
                ));
                if (err) {
                    console.error(err);
                    process.exit();
                }

                // Store the locations for use in Portal
                tag = result.collection.features[0].properties.tags[0];
                features = result.collection.features.map(getFeatureFromRouteTag)

                locations.push({
                    storeName: store.name,
                    storeImageUrl: store.imageUrl,
                    routeTag: tag,
                    featureCollection: {
                        type: "FeatureCollection",
                        features
                    }
                });
            } else {  // Create a new route tag based on Foursquare data
                const request = {
                    near: cityName,
                    chains: store.chainId,
                    limit: 50
                };
                const venues = await apiQuery(request, 1000 * 60 * 60);
                console.info(`${store.name} in ${cityName} venues: ${venues.length}`);

                // Only keep those venues that fall within the region boundary
                const filteredVenues = venues.filter(venue => {
                    const {latitude, longitude} = venue?.geocodes?.main;
                    const venuePoint = point([longitude, latitude]);
                    return booleanPointInPolygon(venuePoint, regionGeometry);
                })
                console.info(`${store.name} in ${cityName} filtered venues: ${filteredVenues.length}`);

                if (filteredVenues.length) {
                    // Create a new route tag in dev, QA, and Prod
                    const tag = `${kebabCase(region)}-${kebabCase(store.name)}-stores`;
                    console.info(`Creating a new tag - ${tag}`);

                    // Write feature collection to Location Service in Prod
                    const [url, token] = environmentLookup.get('prod');
                    if (!token) {
                        console.error(`Please retrieve the proper token credentials`);
                        process.exit()
                    }
                    const [err] = await to(createTag(url, token, tag));
                    if (err) {
                        console.error(err);
                        process.exit();
                    }
                    console.info(`Created a new tag - ${tag}`);

                    // Add all venues as features to the new route tag
                    console.info(`Adding ${filteredVenues.length} features to new tag - ${tag}`);
                    for (let filteredVenue of filteredVenues) {
                        const feature = getFeature(filteredVenue, tag);
                        const [err, result] = await to(addFeature(url, token, feature));
                        if (err) {
                            console.error(err);
                            process.exit();
                        }
                        if (String(result.status) !== '201')
                            console.info(result.status)
                    }
                    console.info(`Added ${filteredVenues.length} features to new tag - ${tag}`);

                    locations.push({
                        storeName: store.name,
                        storeImageUrl: store.imageUrl,
                        routeTag: tag,
                        featureCollection: {
                            type: "FeatureCollection",
                            features: filteredVenues.map(getFeatureForPortal)
                        }
                    });
                }
            }
        }
        data.push({city: cityName, region, locations})
    }
    fs.writeFileSync(`./data/store-locations-v1.json`, JSON.stringify(data));
    process.exit()
})()
