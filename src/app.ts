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

// AUTH ROUTES ===========================
import auth from "./modules/auth/auth.route.js";
app.use("/api/v1/auth", auth);

// PROFILE ROUTES ======================
import profileRoutes from "./modules/profile/profile.routes.js";
app.use("/api/v1/profile", profileRoutes);

// ERROR-MIDDLEWARE======================================
import errorMiddleware from "./middleware/error.middleware.js";
app.use(errorMiddleware);
export default app;
