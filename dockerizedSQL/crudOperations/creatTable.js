async function createUsersTable(connection) {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        useremail VARCHAR(100) NOT NULL UNIQUE,
        age INT,
        location VARCHAR(100),
        mobile VARCHAR(15)
      )
    `;
    await connection.execute(createTableSQL);
    console.log("✅ users table created successfully");
  } catch (err) {
    console.error("❌ Failed to create users table:", err.message);
  }
}
module.exports = {
  createUsersTable,
};
