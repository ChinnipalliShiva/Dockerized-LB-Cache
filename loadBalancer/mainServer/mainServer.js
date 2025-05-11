const express = require("express");
const app = express();
const middleware = require("./middleWare/middleware.js");
const { roundRobin } = require("./roundRobin/roundRobin.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware);

app.listen(3000, () => {
  console.log("Main server is running on port 3000");
});
app.post("/", async (req, res) => {
  try {
    console.log("req.json", req.body);
    let result = await roundRobin(req.body);
    console.log("Data received from server to main server:", result.data);
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
