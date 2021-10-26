const {to} = require('await-to-js');
const crypto = require('crypto');
const redisClient = require('./redis-client');
const rp = require('request-promise');

const cachingQuery = (module.exports = (uri, qs, token, ttl = 0) => {
  return new Promise(async (resolve, reject) => {
    let err, results;

    const hash = crypto.createHash('sha1')
        .update(JSON.stringify(uri + qs))
        .digest('hex');
    redisClient.getCache('web_proxy', hash, async (err, data) => {
      if (err || !data) {
        [err, results] = await to(_execute(uri, qs, token, ttl));
        if (err) return reject(err);
        return resolve(results);
      } else {
        return resolve(data);
      }
    });
  });
});

function _execute(uri, qs, token, ttl) {
  return new Promise(async (resolve, reject) => {
    let err;
    let result
    const hash = crypto.createHash('sha1')
        .update(JSON.stringify(uri + qs))
        .digest('hex');
    [err, result] = await to(rp({
      uri,
      qs,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`
      },
      json: true
    }));
    if (err) {
      return reject(err)
    }

    redisClient.setCache('web_proxy', hash, ttl, result, (err, data) => {
      if (err || !data) return reject('Error getting redis cache');
      return resolve(result);
    });
  });
}
