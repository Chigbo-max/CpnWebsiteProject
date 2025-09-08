const redis = require('redis');

let client = null;


if (process.env.NODE_ENV == 'production'){
client = redis.createClient({
  url: process.env.REDIS_URL
});


client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();
}
else{
    console.log("Redis skipped in development mode");
  }


module.exports = client; 