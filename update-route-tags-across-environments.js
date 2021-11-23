#!/usr/bin/env node
'use strict';

require('dotenv').config();
const {to} = require("await-to-js");
const rp = require("request-promise");
const query = require('./caching/web-proxy-query');
const {environmentLookup, cities} = require('./constants');

(async () => {
    for (let metroCity of cities.slice(0, 1)) {
        const {tags} = metroCity;
        console.info(`Starting city - ${metroCity.name}`)
        for (let routeTag of tags) {

            console.info(`Starting tag - ${routeTag.tag}`)

            // Get feature collection from prod
            const [url, token] = environmentLookup.get('prod');
            const [err, productionResult] = await to(query(
                `${url}/route/${routeTag.tag}/features`,
                {onlyActive: true},
                token,
                1000 * 60 * 60
            ));
            if (err) {
                console.error(err);
                process.exit();
            }

            console.log(`production count - ${productionResult.collection.features.length}`)
            const productionFeatures = productionResult.collection.features.map(d => {
                delete d.id;
                delete d.uuid;
                delete d.properties.id;
                delete d.properties.lastModified;
                delete d.properties.created;
                delete d.properties.refs;
                delete d.properties.version;
                delete d.geometry.crs;
                return d;
            });

            // Write feature collection to Location Service in QA and DEV
            for (let environment of ['qa', 'dev'].slice(1, 2)) {
                const [url, token] = environmentLookup.get(environment);
                // Get feature collection from Location Service in each environment
                const [err, result] = await to(query(
                    `${url}/route/${routeTag.tag}/features`,
                    {onlyActive: true},
                    token,
                    1000 * 60 * 60
                ));
                if (err) {
                    console.error(err);
                    process.exit();
                }

                // If the collection is empty, then let's use the production result to update QA
                console.info(`${environment} count - ${result.collection.features.length}`);
                if (!result.collection.features.length) {
                    console.info(`performing an update in ${environment} ${url} for ${productionFeatures.length}`);

                    // Create the tag
                    const [err] = await to(rp({
                        method: 'PUT',
                        uri: `${url}/route/tags/${routeTag.tag}`,
                        body: {
                            active: true,
                        },
                        headers: {
                            accept: 'application/json',
                            authorization: `Bearer ${token}`
                        },
                        json: true
                    }));
                    if (err) {
                        console.error(err);
                        process.exit();
                    }

                    // Take the first 10 features and add to QA or Dev
                    for (let feature of productionFeatures.slice(0, 10)) {
                        const [err, result] = await to(rp({
                            method: 'POST',
                            uri: `${url}/route/features`,
                            body: {
                                ...feature,
                            },
                            headers: {
                                accept: 'application/json',
                                authorization: `Bearer ${token}`
                            },
                            json: true
                        }));
                        if (err) {
                            console.error(err);
                            process.exit();
                        }
                        console.info(result.status)
                    }
                }
            }
        }
    }
    process.exit()
})()
