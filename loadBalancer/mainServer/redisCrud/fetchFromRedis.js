const fetchFromRedis = async (client, username) => {
  try {
    const result = await client.get(username);

    if (result) {
      console.log(`✅ Cache hit for ${username}`);
      return result; // Returning the entire user data as a JSON string
    }

    console.log(`⚠️ Cache miss for ${username}`);
    return null;
  } catch (error) {
    console.error("❌ Error accessing Redis:", error.message);
    throw new Error("Redis GET operation failed");
  }
};

module.exports = {
  fetchFromRedis,
};
