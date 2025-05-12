const mysql = require("mysql2/promise");

let pool;

async function connectToDatabase() {
  if (pool) return pool; // Reuse the pool if already created

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "sql-container",
      // host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "testuser",
      password: process.env.DB_PASSWORD || "testpass",
      database: process.env.DB_NAME || "testdb",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test a connection
    await pool.getConnection();
    console.log("✅ Connected to MySQL (pooled)");

    return pool;
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
    throw new Error("MySQL pool connection failed");
  }
}

module.exports = {
  connectToDatabase,
};
