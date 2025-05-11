const payload = require("../sampleData/sampleUserData.js");

async function insertUsers(connection) {
  const insertQuery = `
    INSERT INTO users (username, useremail, age, location, mobile)
    VALUES (?, ?, ?, ?, ?)
  `;
  for (const user of payload) {
    try {
      await connection.execute(insertQuery, [
        user.username,
        user.useremail,
        user.age,
        user.location,
        user.mobile,
      ]);
    } catch (err) {
      console.warn(`⚠️ Skipped user '${user.username}': ${err.message}`);
    }
  }
  console.log("✅ All valid users inserted");
}
module.exports = {
  insertUsers,
};
