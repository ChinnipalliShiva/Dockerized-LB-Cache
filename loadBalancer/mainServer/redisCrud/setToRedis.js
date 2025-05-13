const setToRedis = async (client, username, userData) => {
  try {
    const value = JSON.stringify(userData); // Ensure the user data is stored as JSON
    const result = await client.set(username, value, {
      EX: 3600, // Optional TTL of 1 hour (can be adjusted as needed)
    });

    if (result !== "OK") {
      throw new Error("Redis SET failed");
    }

    console.log(`✅ Data added to Redis for ${username}`);
    return { status: "success", data: userData };
  } catch (error) {
    console.error("❌ Error adding data to Redis:", error.message);
    throw new Error("Redis SET operation failed");
  }
};

module.exports = {
  setToRedis,
};
