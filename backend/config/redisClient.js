const redis = require('redis');

let client = null;


if (process.env.NODE_ENV == 'production' && process.env.REDIS_URL) {
  client = redis.createClient({
    url: process.env.REDIS_URL
  });


  client.on('error', (err) => console.error('Redis Client Error:', err));

  (async () => {
    if (!client.isOpen) {
      await client.connect();
      console.log('Redis connected successfully');
    }
  })();
}
else {
  console.log("Redis skipped in development mode");
}


module.exports = client; 