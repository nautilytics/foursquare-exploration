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
// Foursquare API Calls
// ========================
redisClient.getCache = (key, next) => {
    redisClient.get(`four_square:${key}`, (err, result) => {
        if (err || !result) return next(err);
        return next(null, JSON.parse(result));
    });
};

redisClient.setCache = (key, ttl, data, next) => {
    redisClient.setex(`four_square:${key}`, ttl, JSON.stringify(data), (err, result) => {
        if (err || !result) return next(err);
        return next(null, result);
    });
};
