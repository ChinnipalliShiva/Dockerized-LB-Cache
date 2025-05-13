async function fetchAllUsers(connection) {
  try {
    const [rows] = await connection.execute(`SELECT * FROM users`);
    console.log("📋 Users:");
    console.table(rows);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err.message);
  }
}
module.exports = {
  fetchAllUsers,
};