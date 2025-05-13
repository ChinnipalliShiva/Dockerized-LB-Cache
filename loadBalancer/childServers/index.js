const express = require("express");
const servers = require("./serverConfig");
const { sqlConnection } = require("./sqlConnection/sqlConnection");
const { fetchUserFromSql } = require("./sqlCrud/fetchUserFromSql");

let sqlClient;

// Initialize MySQL Connection (once for all servers)
async function initializeConnections() {
  try {
    sqlClient = await sqlConnection();
    console.log("✅ Connected to SQL");
  } catch (error) {
    console.error("❌ Error initializing SQL connection:", error.message);
    process.exit(1);
  }
}

// Graceful Shutdown
async function closeConnections() {
  try {
    if (sqlClient) await sqlClient.end();
    console.log("✅ SQL connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
    process.exit(1);
  }
}

// Create Servers
const createServers = async () => {
  await initializeConnections();
  for (let server of servers) {
    const app = express();
    app.use(express.json());
    app.post("/child/getUser", async (req, res) => {
      try {
        const userData = await fetchUserFromSql(sqlClient, req.body); // optionally get params from req.query
        if (userData.status === "error" && userData.data === null) {
          console.error("❌ User not found in SQL");
          return res
            .status(200)
            .json({ success: false, message: userData.message });
        }
        res.status(200).json({ success: true, data: userData });
      } catch (error) {
        console.error("❌ Error fetching user data:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
    app.listen(server.port, () => {
      console.log(`🚀 Server is running on port ${server.port}`);
    });
  }
  // Set shutdown handler only once
  process.once("SIGINT", closeConnections);
  process.once("SIGTERM", closeConnections);
};

createServers();
