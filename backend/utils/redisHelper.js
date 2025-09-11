const redisClient = require('../config/redisClient');

/**
 * Safely get a value from Redis.
 * @param {string} key - Cache key.
 * @returns {Promise<string|null>} The cached value or null if unavailable.
 */
async function redisSafeGet(key) {
  try {
    if (redisClient && redisClient.isOpen) {
      return await redisClient.get(key);
    }
  } catch (err) {
    console.error(`Redis GET error for key ${key}:`, err.message);
  }
  return null;
}

/**
 * Safely set a value in Redis with expiration.
 * @param {string} key - Cache key.
 * @param {number} ttl - Time to live in seconds.
 * @param {string} value - Value to cache.
 */
async function redisSafeSetEx(key, ttl, value) {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(key, ttl, value);
    }
  } catch (err) {
    console.error(`Redis SETEX error for key ${key}:`, err.message);
  }
}

/**
 * Safely clear one or more cache keys.
 * @param {string|string[]} keys - A single cache key or an array of cache keys.
 */
async function clearCache(keys) {
  if (!redisClient) return;
  const keyList = Array.isArray(keys) ? keys : [keys];
  try {
    if (keyList.length > 0) {
      await redisClient.del(keyList);
      console.log(`Cleared cache for keys: ${keyList.join(', ')}`);
    }
  } catch (err) {
    console.error('Redis clearCache error:', err.message);
  }
}

module.exports = {
  redisSafeGet,
  redisSafeSetEx,
  clearCache,
};
