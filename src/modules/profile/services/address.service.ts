import { Types } from "mongoose";

import { ApiError } from "../../../utils/apiError.js";

import { addressRepository } from "../repository/address.repository.js";
import { profileRepository } from "../repository/profile.repository.js";

import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "../schemas/address.schema.js";

import type { IAddress } from "../types/address.types.js";

export class AddressService {
  // ADD ADDRESS
  async addAddress(userId: string, data: CreateAddressInput) {
    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError(
        404,
        "Profile not found. Please create your profile first.",
      );
    }

    const existingAddresses =
      await addressRepository.findAddressesByUserId(userId);

    const addressData: IAddress = {
      label: data.label,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      isDefault: existingAddresses.length === 0,

      ...(data.houseNumber !== undefined && {
        houseNumber: data.houseNumber,
      }),
      ...(data.buildingName !== undefined && {
        buildingName: data.buildingName,
      }),
      ...(data.street !== undefined && {
        street: data.street,
      }),
      ...(data.area !== undefined && {
        area: data.area,
      }),
      ...(data.latitude !== undefined && {
        latitude: data.latitude,
      }),
      ...(data.longitude !== undefined && {
        longitude: data.longitude,
      }),
    };

    const updatedProfile = await addressRepository.addAddress(
      userId,
      addressData,
    );

    if (!updatedProfile) {
      throw new ApiError(404, "Profile not found");
    }

    return updatedProfile.addresses[updatedProfile.addresses.length - 1];
  }

  // GET ALL ADDRESSES
  async getAddresses(userId: string) {
    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    return addressRepository.findAddressesByUserId(userId);
  }

  // GET SINGLE ADDRESS
  async getAddressById(userId: string, addressId: string) {
    if (!Types.ObjectId.isValid(addressId)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const address = await addressRepository.findAddressById(userId, addressId);

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    return address;
  }

  // UPDATE ADDRESS
  async updateAddress(
    userId: string,
    addressId: string,
    data: UpdateAddressInput,
  ) {
    if (!Types.ObjectId.isValid(addressId)) {
      throw new ApiError(400, "Invalid address ID");
    }

    // Exclude undefined optional properties
    const updateData: Partial<IAddress> = {
      ...(data.label !== undefined && {
        label: data.label,
      }),
      ...(data.houseNumber !== undefined && {
        houseNumber: data.houseNumber,
      }),
      ...(data.buildingName !== undefined && {
        buildingName: data.buildingName,
      }),
      ...(data.street !== undefined && {
        street: data.street,
      }),
      ...(data.area !== undefined && {
        area: data.area,
      }),
      ...(data.city !== undefined && {
        city: data.city,
      }),
      ...(data.state !== undefined && {
        state: data.state,
      }),
      ...(data.country !== undefined && {
        country: data.country,
      }),
      ...(data.pincode !== undefined && {
        pincode: data.pincode,
      }),
      ...(data.latitude !== undefined && {
        latitude: data.latitude,
      }),
      ...(data.longitude !== undefined && {
        longitude: data.longitude,
      }),
    };

    const address = await addressRepository.updateAddress(
      userId,
      addressId,
      updateData,
    );

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    return address;
  }

  // DELETE ADDRESS
  async deleteAddress(userId: string, addressId: string) {
    if (!Types.ObjectId.isValid(addressId)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const existingAddress = await addressRepository.findAddressById(
      userId,
      addressId,
    );

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    const updatedProfile = await addressRepository.deleteAddress(
      userId,
      addressId,
    );

    if (!updatedProfile) {
      throw new ApiError(404, "Address not found");
    }

    // Promote another address if the deleted address was default
    if (existingAddress.isDefault && updatedProfile.addresses.length > 0) {
      const nextAddress = updatedProfile.addresses[0];

      if (nextAddress?.userId) {
        await addressRepository.setDefaultAddress(
          userId,
          nextAddress.userId.toString(),
        );
      }
    }

    return {
      addressId,
      deleted: true,
    };
  }

  // SET DEFAULT ADDRESS
  async setDefaultAddress(userId: string, addressId: string) {
    if (!Types.ObjectId.isValid(addressId)) {
      throw new ApiError(400, "Invalid address ID");
    }

    const address = await addressRepository.findAddressById(userId, addressId);

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    if (address.isDefault) {
      return address;
    }

    const updatedAddress = await addressRepository.setDefaultAddress(
      userId,
      addressId,
    );

    if (!updatedAddress) {
      throw new ApiError(404, "Address not found");
    }

    return updatedAddress;
  }
}

export const addressService = new AddressService();
