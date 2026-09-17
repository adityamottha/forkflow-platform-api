import { Schema, model } from "mongoose";

const AuthUserSchema = new Schema({}, {});

export const AuthUser = model("AuthUser", AuthUserSchema);
