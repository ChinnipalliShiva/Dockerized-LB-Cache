const express = require("express");
const servers = require("./serverConfig");

const createServer = () => {
  for (let server of servers) {
    const app = express();
    app.use(express.json());
    app.listen(server.port, () => {
      console.log(`Server is running on port ${server.port}`);
    });

    app.get("/data", (req, res) => {
      console.log("req.body child", req.body);
      res.json({
        message: `Hello from ${server.name}`,
        data: {
          serverName: server.name,
          serverHost: server.host,
          serverPort: server.port,
          userInfo: req.body.user || null,
        },
      });
    });
  }
};

createServer();
