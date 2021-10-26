const redis = require('redis');

const redisClient = (module.exports = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST,
    {no_ready_check: true}
));

redisClient.on('error', (err) => console.log('Redis ' + err));

setInterval(function () {
    redisClient.ping();
}, 1000 * 30);

// ========================
// API Calls
// ========================
redisClient.getCache = (prefix, key, next) => {
    redisClient.get(`${prefix}:${key}`, (err, result) => {
        if (err || !result) return next(err);
        return next(null, JSON.parse(result));
    });
};

redisClient.setCache = (prefix, key, ttl, data, next) => {
    redisClient.setex(`${prefix}:${key}`, ttl, JSON.stringify(data), (err, result) => {
        if (err || !result) return next(err);
        return next(null, result);
    });
};
