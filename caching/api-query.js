const { to } = require('await-to-js');
const crypto = require('crypto');
const redisClient = require('./redis-client');
const rp = require('request-promise');

/**
 * Execute an API call
 * @param {any}           client    Google Cloud Vision Client
 * @param {String}        qs        Query string
 * @param {Number}        ttl       Expiration of cache in seconds
 */
const cachingQuery = (module.exports = (qs, ttl = 0) => {
  return new Promise(async (resolve, reject) => {
    let err, results;

    if (ttl) {
      // If we have caching enabled
      const hash = crypto.createHash('sha1')
          .update(JSON.stringify(qs))
          .digest('hex');
      redisClient.getCache(hash, async (err, data) => {
        if (err || !data) {
          [err, results] = await to(_execute(qs, ttl));
          if (err) return reject(err);
          return resolve(results);
        } else {
          return resolve(data);
        }
      });
    } else {
      [err, results] = await to(_execute(client, imageURL, ttl));
      if (err) return reject(err);
      return resolve(results);
    }
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
      uri: 'https://api.foursquare.com/v2/venues/search',
      qs,
      json: true
    }));
    if(err) {
      return reject(err)
    }
    if (ttl) {
      redisClient.setCache(hash, ttl, result, (err, data) => {
        if (err || !data) return reject('Error getting redis cache');
        return resolve(result);
      });
    } else {
      return resolve(result);
    }
  });
}
