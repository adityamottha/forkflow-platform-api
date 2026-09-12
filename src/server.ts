import "./config/config.env.js";
import express from "express";
const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT:", `http://localhost:${PORT}`);
});
