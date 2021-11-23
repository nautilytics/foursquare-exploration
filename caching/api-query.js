const {to} = require('await-to-js');
const crypto = require('crypto');
const redisClient = require('./redis-client');
const rp = require('request-promise');

const cachingQuery = (module.exports = (qs, ttl = 0) => {
    return new Promise(async (resolve, reject) => {
        let err, results;

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
        let result
        const hash = crypto.createHash('sha1')
            .update(JSON.stringify(qs))
            .digest('hex');
        [err, result] = await to(rp({
            uri: 'https://api.foursquare.com/v3/places/search',
            headers: {
                'Accept': 'application/json',
                'Authorization': process.env.FOURSQUARE_API_KEY
            },
            qs,
            json: true
        }));
        if (err) {
            return reject(err)
        }

        redisClient.setCache('four_square', hash, ttl, result, (err, data) => {
            if (err || !data) return reject('Error getting redis cache');
            return resolve(result);
        });
    });
}
