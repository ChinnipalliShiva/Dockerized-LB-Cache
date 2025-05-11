const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../sqlConnection/sqlConnection.js");

// Middleware function to validate JWT and attach user data to the request object
const middleware = async (req, res, next) => {
  console.log("Middleware function started.");
  try {
    // Verify the token (this is a placeholder, replace with actual verification logic)
    let token = await validateAuthorization(req);
    let parsedUserData = await parseTokenInfo(token);
    let userData = await getUserData(parsedUserData);
    if (!userData) {
      console.log("❌ User not found.");
      res.status(401).send("Unauthorized");
      return;
    }
    req.body.user = userData; // Attach user data to the request object
    console.log("✅ User data attached to request:", req.user);
    next(); // Call the next middleware or route handler
  } catch (err) {
    console.error("❌ Error in middleware:", err.message);
    res.status(500).send("Internal Server Error");
    return;
  }
};

//validate authorization
const validateAuthorization = async (req) => {
  let auhorization = req.headers["authorization"];
  if (!auhorization) {
    console.log("❌ No authorization header found.");
    throw new Error("No authorization header found");
  }
  let token = auhorization.split(" ")[1];
  if (!token) {
    console.log("❌ No token found in authorization header.");
    throw new Error("No token found in authorization header");
  }
  return token;
};

//parse`
const parseTokenInfo = async (token) => {
  try {
    console.log("Parsing token:", token);
    let userInfo = jwt.verify(token, "test");
    console.log("✅ Token parsed successfully:", userInfo);
    if (!userInfo) {
      console.log("❌ Invalid token.");
      throw new Error("Invalid token");
    }
    return userInfo;
  } catch (error) {
    console.error("❌ Error parsing token:", error.message);
    throw new Error("Invalid token");
  }
};

//get user data
const getUserData = async (userInfo) => {
  try {
    let connection = await connectToDatabase();
    let { id, username, useremail } = userInfo;
    let sqlQuery = `SELECT * FROM users WHERE username = ? AND useremail = ?`;
    let whereCondtions = [username, useremail];
    let [rows] = await connection.query(sqlQuery, whereCondtions);
    return rows[0];
  } catch (error) {
    console.error("❌ Error getting user data:", error.message);
    throw new Error("Error getting user data");
  }
};
module.exports = middleware;
