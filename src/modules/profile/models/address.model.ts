import { Schema } from "mongoose";
import type { IAddress } from "../types/address.types.js";

export const addressSchema = new Schema<IAddress>(
  {
    label: {
      type: String,
      enum: ["HOME", "WORK", "OTHER"],
      required: true,
    },

    houseNumber: {
      type: String,
      trim: true,
      default: null,
    },

    buildingName: {
      type: String,
      trim: true,
      default: null,
    },

    street: {
      type: String,
      trim: true,
      default: null,
    },

    area: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);
