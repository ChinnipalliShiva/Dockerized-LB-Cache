async function showAllTables(connection) {
  try {
    const [tables] = await connection.execute(`SHOW TABLES`);
    console.log("📚 Tables in database:");
    console.table(tables);
  } catch (err) {
    console.error("❌ Failed to list tables:", err.message);
  }
}

module.exports = {
  showAllTables,
};
