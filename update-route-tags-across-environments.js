#!/usr/bin/env node
'use strict';

require('dotenv').config();
const {to} = require("await-to-js");
const rp = require("request-promise");
const query = require('./caching/web-proxy-query');

(async () => {
    const environmentLookup = new Map([
        ['prod', [process.env.WEB_PROXY_PROD_URL, process.env.BEARER_TOKEN_PROD]],
        ['qa', [process.env.WEB_PROXY_QA_URL, process.env.BEARER_TOKEN_QA]],
        ['dev', [process.env.WEB_PROXY_DEV_URL, process.env.BEARER_TOKEN_DEV]],
    ])
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
