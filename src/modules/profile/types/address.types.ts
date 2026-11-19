import mongoose from "mongoose";

export interface IAddress {
  userId?: mongoose.Schema.Types.ObjectId;
  label?: "HOME" | "WORK" | "OTHER";
  houseNumber?: string;
  buildingName?: string;
  street?: string;
  area?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}
