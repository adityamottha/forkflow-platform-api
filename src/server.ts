import dns from "node:dns";
dns.setServers(["8.8.8.8"]);

import "./config/config.env.js";
import app from "./app.js";
import { connectDB } from "./config/config.db.js";

const PORT = process.env.PORT;

const server = () => {
  try {
    connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

server();
