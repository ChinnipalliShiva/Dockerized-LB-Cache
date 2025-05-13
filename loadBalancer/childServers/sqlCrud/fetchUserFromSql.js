async function fetchUserFromSql(connection, filters) {
  const { username, useremail } = filters;
  if (!username || !useremail) {
    console.error("❌ Username or useremail not present in request body");
    throw new Error("Username or useremail not present in request body");
  }

  // Check if the user exists in the database
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE username = ? AND useremail = ?`,
      [username, useremail]
    );

    if (rows.length > 0) {
      console.log("✅ User found:", rows[0]);
      return rows[0]; // Return user data if found
    } else {
      console.log("❌ User not found in SQL");
      return {
        status: "error",
        message: "User not found in SQL",
        data: null,
      };
    }
  } catch (err) {
    console.error("❌ Failed to fetch user:", err.message);
    throw new Error("SQL operation failed");
  }
}

module.exports = {
  fetchUserFromSql,
};
