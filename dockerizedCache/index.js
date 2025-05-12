const express = require("express");

const cacheService = require("./cacheService/cacheService");
const {
  createRedisConnection,
} = require("./redisConnection/createRedisConnection");
const { connectToDatabase } = require("./sqlConnection/sqlConnection");
const app = express();
app.use(express.json());

let redisClient = null;
let sqlClient = null;

// // Establish connections and start server
// const startServer = async () => {
//   try {
//     // redisClient = await createRedisConnection();
//     sqlClient = await connectToDatabase();
//     console.log("Server is running on port 7000");
//     app.listen(7000);
//   } catch (error) {
//     console.error("Failed to start server:", error.message);
//     process.exit(1); // Exit if connections cannot be established
//   }
// };



// // Start the server
// startServer();

// const app = express();
const PORT = process.env.PORT || 7000;

// let sqlClient; // MySQL connection sqlClient
// let redisClient; // Redis client

// Initialize MySQL and Redis Connections
async function initializeConnections() {
  try {
    sqlClient = await connectToDatabase();
    console.log("✅ Connected to MySQL");

    redisClient = await createRedisConnection();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("❌ Error initializing connections:", error.message);
    process.exit(1); // Exit if connections fail
  }
}

// Graceful Shutdown (Close Connections)
async function closeConnections() {
  try {
    if (sqlClient) await sqlClient.end();
    if (redisClient) await redisClient.quit();
    console.log("✅ Connections closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing connections:", error.message);
  }
}

// Route
app.post("/cache", async (req, res) => {
  try {
    let cacheResult = await cacheService(req.body, redisClient, sqlClient);
    if (cacheResult.status === "success") {
      res.status(200).json(cacheResult);
    } else {
      res.status(401).json(cacheResult); // Unauthorized or error responses
    }
  } catch (e) {
    console.error("Error during /cache:", e.message);
    res.status(500).json({
      status: "error",
      message: "Failed to get cache",
      data: [],
    });
  }
});

// Start Server
async function startServer() {
  await initializeConnections();

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  // Graceful Shutdown on SIGINT (Ctrl+C) or SIGTERM
  process.on("SIGINT", closeConnections);
  process.on("SIGTERM", closeConnections);
}

startServer();
