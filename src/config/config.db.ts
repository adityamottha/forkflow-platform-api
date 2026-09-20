import mongoose from "mongoose";
import "./config.env.js";
import { DB_NAME } from "../db.constants.js";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri === undefined) {
      throw new Error("MONGODB_URI is not defined");
    }

    const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`);

    console.log(
      "DATABASE CONNECTED SUCCESSFULLY!",
      connectionInstance.connection.host,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("DATABASE CONNECTION FAILED!", error.message);
    } else {
      console.error("DATABASE CONNECTION FAILED!", error);
    }

    process.exit(1);
  }
};
