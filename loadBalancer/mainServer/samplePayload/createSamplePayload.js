const jwt = require("jsonwebtoken");
const users = require("./samplePayload"); // Replace with actual path
const secretKey = "test";

const usersWithTokens = users.map((user) => {
  const payload = {
    username: user.username,
    useremail: user.useremail,
  };
  console.log("Payload:", payload);
  const token = jwt.sign(payload, secretKey);

  return {
    ...user,
    token,
  };
});

const writeToFile = async () => {
  const fs = require("fs");
  const path = require("path");

  const filePath = path.join(__dirname, "samplePayloadWithJWT.js");
  const content = `const samplePayloadWithJWT = ${JSON.stringify(
    usersWithTokens,
    null,
    2
  )};\n\nmodule.exports = samplePayloadWithJWT;`;

  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ samplePayloadWithJWT.js has been written successfully.");
};

// 👉 Call the function
writeToFile();
