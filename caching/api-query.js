const {to} = require('await-to-js');
const crypto = require('crypto');
const redisClient = require('./redis-client');
const rp = require('request-promise');

const cachingQuery = (module.exports = (qs, ttl = 0) => {
    return new Promise(async (resolve, reject) => {
        let results;

        const hash = crypto.createHash('sha1')
            .update(JSON.stringify(qs))
            .digest('hex');
        redisClient.getCache('four_square', hash, async (err, data) => {
            if (err || !data) {
                [err, results] = await to(_execute(qs, ttl));
                if (err) return reject(err);
                return resolve(results);
            } else {
                return resolve(data);
            }
        });
    });
});

function _execute(qs, ttl) {
    return new Promise(async (resolve, reject) => {
        let err;
        let response;
        let link;
        let results = [];
        const hash = crypto.createHash('sha1')
            .update(JSON.stringify(qs))
            .digest('hex');
        do {
            if (!link) {
                [err, response] = await to(rp({
                    uri: 'https://api.foursquare.com/v3/places/search',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': process.env.FOURSQUARE_API_KEY
                    },
                    qs,
                    json: true,
                    resolveWithFullResponse: true
                }));
            } else {
                [err, response] = await to(rp({
                    uri: link,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': process.env.FOURSQUARE_API_KEY
                    },
                    json: true,
                    resolveWithFullResponse: true
                }))
            }
            if (err) {
                return reject(err)
            }

            link = response.headers.link && response.headers.link.match(/(?<=<).*?(?=>)/g)[0];
            results = results.concat(response.body.results)
        } while (link);

        redisClient.setCache('four_square', hash, ttl, results, (err, data) => {
            if (err || !data) {
                console.error(err);
                return reject('Error setting redis cache');
            }
            return resolve(results);
        });
    });
}
