const normalizeUrl = require('normalize-url');
const Redis = require('ioredis');

class RedisCache
{
  constructor(redisUrl, options) {
    this.expire = options.cacheMaxAge || 3600; // default to 1 hr
    this.redis = new Redis(redisUrl);
	}

  clean() {
    return true
	}

  clear() {
    //this.redis.flushdb();
    return true
	}

  delete(url) {
    let key = normalizeUrl(url.href);
    return this.redis.del(key);
	}

  get(url) {
    let key = normalizeUrl(url.href);
    return this.redis.get(key, (err, value) => {
      if(value) {
        let json = JSON.parse(value);
        return json
      }
      else {
        return null
      }
    });
	}

  set(url, value, options={}) {
    let key = normalizeUrl(url.href);
    let json = JSON.stringify(value);
    return this.redis.set(key, json, "EX", this.expire)
  }
}

module.exports = RedisCache;
