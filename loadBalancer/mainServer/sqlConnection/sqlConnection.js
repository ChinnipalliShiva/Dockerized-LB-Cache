const mysql = require("mysql2/promise");

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 8000,
      user: "testuser",
      password: "testpass",
      database: "testdb",
    });
    console.log("✅ Connected to MySQL");
    return connection;
  } catch (err) {
    console.error("❌ Failed to connect to database:", err.message);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
};
