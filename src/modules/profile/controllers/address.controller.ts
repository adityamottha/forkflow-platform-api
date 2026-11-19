import type { Request, Response } from "express";

import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";

import { addressService } from "../services/address.service.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "../schemas/address.schema.js";

export class AddressController {
  // GET AUTHENTICATED USER ID
  private getUserId(req: Request): string {
    const userId = req.user?._id?.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    return userId;
  }

  // GET ADDRESS ID
  private getAddressId(req: Request): string {
    const addressId = req.params.addressId;

    if (typeof addressId !== "string" || !addressId) {
      throw new ApiError(400, "Address ID is required");
    }

    return addressId;
  }

  // ADD ADDRESS
  async addAddress(req: Request, res: Response) {
    const userId = this.getUserId(req);

    const validatedData = createAddressSchema.parse(req.body);

    const result = await addressService.addAddress(userId, validatedData);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Address added successfully"));
  }

  // GET ALL ADDRESSES
  async getAddresses(req: Request, res: Response) {
    const userId = this.getUserId(req);

    const result = await addressService.getAddresses(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Addresses fetched successfully"));
  }

  // GET SINGLE ADDRESS
  async getAddressById(req: Request, res: Response) {
    const userId = this.getUserId(req);
    const addressId = this.getAddressId(req);

    const result = await addressService.getAddressById(userId, addressId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Address fetched successfully"));
  }

  // UPDATE ADDRESS
  async updateAddress(req: Request, res: Response) {
    const userId = this.getUserId(req);
    const addressId = this.getAddressId(req);

    const validatedData = updateAddressSchema.parse(req.body);

    const result = await addressService.updateAddress(
      userId,
      addressId,
      validatedData,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Address updated successfully"));
  }

  // DELETE ADDRESS
  async deleteAddress(req: Request, res: Response) {
    const userId = this.getUserId(req);
    const addressId = this.getAddressId(req);

    const result = await addressService.deleteAddress(userId, addressId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Address deleted successfully"));
  }

  // SET DEFAULT ADDRESS
  async setDefaultAddress(req: Request, res: Response) {
    const userId = this.getUserId(req);
    const addressId = this.getAddressId(req);

    const result = await addressService.setDefaultAddress(userId, addressId);

    return res
      .status(200)
      .json(
        new ApiResponse(200, result, "Default address updated successfully"),
      );
  }
}

export const addressController = new AddressController();
