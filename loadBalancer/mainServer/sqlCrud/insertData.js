const usersWithJWT = require("../samplePayload/samplePayloadWithJWT.js");
const users = require("../samplePayload/sampleUserData.js");

async function insertUserInfo(connection) {
  const insertQuery = `
    INSERT INTO users (username, useremail, age, location, mobile)
    VALUES (?, ?, ?, ?, ?)
  `;

  for (const user of users) {
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
  console.log("✅ User info inserted");
}

async function insertUserJWT(connection) {
  const insertQuery = `
    INSERT INTO users (username, useremail, jwt)
    VALUES (?, ?, ?)
  `;

  for (const user of usersWithJWT) {
    try {
      await connection.execute(insertQuery, [
        user.username,
        user.useremail,
        user.token, // Make sure this matches your data structure
      ]);
    } catch (err) {
      console.warn(`⚠️ Skipped JWT user '${user.username}': ${err.message}`);
    }
  }
  console.log("✅ JWT users inserted");
}

module.exports = {
  insertUserInfo,
  insertUserJWT,
};
