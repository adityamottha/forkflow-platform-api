import "./config/config.env.js";
import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public/temp"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running");
});
export default app;
