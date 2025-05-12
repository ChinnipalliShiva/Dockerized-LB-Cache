const redis = require("redis");

const createRedisConnection = async () => {
  const client = redis.createClient({
    url: "redis://redis-container:6379",
  });

  // const client = redis.createClient({
  //   url: process.env.REDIS_URL || "redis://localhost:6379",
  // });

  try {
    await client.connect();
    console.log("✅ Connected to Redis");
    return client;
  } catch (error) {
    console.error("❌ Redis connection error:", error.stack || error.message);
    throw new Error("Redis connection failed");
  }
};

module.exports = {
  createRedisConnection,
};
