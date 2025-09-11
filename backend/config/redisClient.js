const redis = require('redis');

let redisClient = null;

if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on('error', (err) => console.error('Redis Client Error:', err));

  (async () => {
    try {
      await redisClient.connect();
      console.log('Redis connected successfully');
    } catch (err) {
      console.error('Redis connection failed:', err);
      redisClient = null;
    }
  })();
} else {
  console.log("Redis skipped in development mode");
}

module.exports = redisClient;