const { fetchFromRedis } = require("../redisCrud/fetchFromRedis");

const getCache = async (reqBody, redisClient) => {
  if (!redisClient) {
    console.error("❌ Error while connecting to Redis");
    throw new Error("Error while connecting to Redis");
  }
  try {
    const { username } = extractUserData(reqBody);
    // Check Redis cache for the complete user data
    const cachedData = await fetchFromRedis(redisClient, username);
    if (cachedData) {
      console.log(`✅ Cache hit for user: ${username}, data: ${cachedData}`);
      return {
        status: "success",
        message: "User found in cache",
        data: JSON.parse(cachedData),
      };
    } else {
      console.log(`❌ Cache miss for user: ${username}`);
      return {
        status: "error",
        message: "User not found in cache",
        data: [],
      };
    }
  } catch (error) {
    console.error("❌ Error in getCache:", error.message);
    return { status: "error", message: "Failed to get cache", data: [] };
  }
};

const extractUserData = (body) => {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }
  const { username, useremail } = body;
  if (!username || !useremail) {
    throw new Error("Missing 'username' or 'useremail' in request body");
  }
  return { username, useremail };
};

module.exports = getCache;
