const { fetchAllUsers } = require("./crudOperations/checkData");
const { createUsersTable } = require("./crudOperations/creatTable");
const { deleteTables } = require("./crudOperations/deleteTables");
const { insertUsers } = require("./crudOperations/insertData");
const { showAllTables } = require("./crudOperations/showTables");
const { connectToDatabase } = require("./sqlConnection/sqlConnection");

async function main() {
  let connection;
  try {
    connection = await connectToDatabase();
    await deleteTables(connection);
    await createUsersTable(connection);
    await insertUsers(connection);
    await fetchAllUsers(connection);
    await showAllTables(connection);
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("✅ Connection closed");
    }
  }
}

main();
