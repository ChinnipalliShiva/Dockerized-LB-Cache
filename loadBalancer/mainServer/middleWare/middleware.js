const jwt = require("jsonwebtoken");

// Factory function that returns actual middleware
const middleware = (sqlClient) => {
  return async (req, res, next) => {
    console.log("Middleware function started.");
    try {
      let token = await validateAuthorization(req);
      let parsedUserData = await parseTokenInfo(token);

      // Use the passed-in sqlClient here
      let userData = await getUserData(parsedUserData, sqlClient);
      if (!userData) {
        console.log("❌ User not found.");
        return res.status(401).send("Unauthorized");
      }

      req.body.user = userData; // Attach user data to request
      console.log("✅ User data attached to request:", req.body.user);
      next();
    } catch (err) {
      console.error("❌ Error in middleware:", err.message);
      res.status(500).send({
        message:err.message,
        success: false,
      });
    }
  };
};

// Validate JWT Authorization Header
const validateAuthorization = async (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) throw new Error("No authorization header found");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("No token found in authorization header");

  return token;
};

// Parse and verify token
const parseTokenInfo = async (token) => {
  try {
    const userInfo = jwt.verify(token, "test");
    if (!userInfo) throw new Error("Invalid token");
    return userInfo;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Get user data from DB using passed sqlClient
const getUserData = async (userInfo, sqlClient) => {
  const { username, useremail } = userInfo;
  const sqlQuery = `SELECT * FROM users WHERE username = ? AND useremail = ?`;
  const [rows] = await sqlClient.query(sqlQuery, [username, useremail]);
  return rows[0];
};

module.exports = middleware;
