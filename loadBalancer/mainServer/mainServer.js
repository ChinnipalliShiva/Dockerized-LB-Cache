const express = require("express");
const app = express();
const middleware = require("./middleWare/middleware.js");
const { roundRobin } = require("./roundRobin/roundRobin.js");
const cacheService = require("./cacheService/cacheService.js");
const {
  createRedisConnection,
} = require("./redisConnection/createRedisConnection.js");
const { setToRedis } = require("./redisCrud/setToRedis.js");
const { sqlConnection } = require("./sqlConnection/sqlConnection.js");
const { createUsersTable } = require("./sqlCrud/creatTable.js");
const { insertUserInfo, insertUserJWT } = require("./sqlCrud/insertData.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
let redisClient;
let sqlClient;

// Initialize MySQL and Redis Connections
async function initializeConnections() {
  try {
    redisClient = await createRedisConnection();
    sqlClient = await sqlConnection();
    console.log("✅ Connected to Redis and SQL");
  } catch (error) {
    console.error("❌ Error initializing connections:", error.message);
    process.exit(1); // Exit if connections fail
  }
}

// Graceful Shutdown (Close Connections)
async function closeConnections() {
  try {
    if (redisClient) await redisClient.quit();
    console.log("✅ Connections closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing connections:", error.message);
  }
}

// Start Server
async function startServer() {
  console.log("🚀 Starting server...");
  await initializeConnections();
  // ✅ Now sqlClient is ready
  app.use(middleware(sqlClient));
  //create user table
  await createUsersTable(sqlClient);
  console.log("✅ Users table created");

  // Insert sample data into the database
  await insertUserInfo(sqlClient);
  await insertUserJWT(sqlClient);
  console.log("✅ Sample data inserted into the database");

  app.post("/getUser", async (req, res) => {
    try {
      let result;
      let dataSource = "cache"; // default assumption

      console.log("req.json", req.body);
      result = await cacheService(req.body, redisClient);
      console.log("result", result);

      if (result.status === "error") {
        dataSource = "db"; // fallback to DB if cache miss
        result = await roundRobin(req.body);

        if (
          result.status === "error" &&
          (result.data === null || result.data.length <= 0)
        ) {
          console.error("❌ User not found in SQL");
          return res
            .status(404)
            .json({ success: false, message: result.message });
        }

        // Store the complete user data in Redis
        const redisSet = await setToRedis(
          redisClient,
          req.body.username,
          result.data
        );

        if (!redisSet) {
          throw new Error("Failed to store user data in Redis");
        }

        console.log(`✅ Data stored in Redis for user: ${req.body.username}`);
      }

      console.log(`✅ Data received from ${dataSource}:`, result.data);

      res.status(200).json({
        success: true,
        source: dataSource,
        data: result.data.data || result.data, // normalize in case cache vs db return shapes differ
      });
    } catch (error) {
      console.error("❌ Error in /getUser:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  // Graceful Shutdown on SIGINT (Ctrl+C) or SIGTERM
  process.on("SIGINT", closeConnections);
  process.on("SIGTERM", closeConnections);
}

startServer();
