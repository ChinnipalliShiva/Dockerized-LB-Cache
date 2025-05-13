async function deleteTables(connection) {
  try {
    const [tables] = await connection.execute(`SHOW TABLES`);
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      await connection.execute(`DROP TABLE IF EXISTS ${tableName}`);
      console.log(`✅ Dropped table: ${tableName}`);
    }
  } catch (err) {
    console.error("❌ Failed to drop tables:", err.message);
  }
}
module.exports = {
  deleteTables,
};
