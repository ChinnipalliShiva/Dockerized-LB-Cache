const { fetchUserFromSql } = require("../sqlCrud/fetchUserFromSql");
const { setToRedis } = require("../redisCrud/setToRedis");
const { fetchFromRedis } = require("../redisCrud/fetchFromRedis");


const getCache = async (reqBody, redisClient, sqlClient) => {
  if (!redisClient) {
    console.error("❌ Error while connecting to Redis");
    throw new Error("Error while connecting to Redis");
  }
  if (!sqlClient) {
    console.error("❌ Error while connecting to SQL");
    throw new Error("Error while connecting to SQL");
  }

  try {
    const { username, useremail } = extractUserData(reqBody);

    // Check Redis cache for the complete user data
    const cachedData = await fetchFromRedis(redisClient, username);
    if (cachedData) {
      console.log(`✅ Cache hit for user: ${username}`);
      return {
        status: "success",
        message: "User found in cache",
        data: JSON.parse(cachedData),
      };
    }

    console.log(`⚠️ Cache miss for user: ${username}, checking SQL...`);

    // Check SQL if cache miss
    const userData = await fetchUserFromSql(sqlClient, {
      username,
      useremail,
    });
    if (!userData) {
      console.log("❌ User not found in SQL");
      return { status: "error", message: "Unauthorized user", data: [] }; // Empty array when user is not found
    }

    // Store the complete user data in Redis
    const redisSet = await setToRedis(redisClient, username, userData);
    if (!redisSet) {
      throw new Error("Failed to store user data in Redis");
    }

    console.log(`✅ Data stored in Redis for user: ${username}`);
    return {
      status: "success",
      message: "User found in SQL and saved to cache",
      data: userData,
    };
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
