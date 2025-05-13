const axios = require("axios");
let serverPorts = [3001, 3002, 3003];
let currentServerIndex = 0;

const roundRobin = async (body) => {
  let currentServer = serverPorts[currentServerIndex];
  currentServerIndex = (currentServerIndex + 1) % serverPorts.length;
  try {
    //localhost
    // const result = await axios.post(
    //   `http://localhost:${currentServer}/child/getUser`,
    //   body
    // );

    //docker `my-servers`
    const result = await axios.post(
      `http://my-servers:${currentServer}/child/getUser`, // Docker service name
      body
    );
    console.log("✅ Data received from server:", result);
    return result;
  } catch (error) {
    console.error("Error in roundRobin:", error.message);
    throw new Error("Error in roundRobin");
  }
};
module.exports = {
  roundRobin,
};
