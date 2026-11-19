import { Profile } from "../models/profile.model.js";
import type { IAddress } from "../types/address.types.js";

export class AddressRepository {
  // ADD ADDRESS
  async addAddress(userId: string, addressData: IAddress) {
    return Profile.findOneAndUpdate(
      { userId },
      {
        $push: {
          addresses: addressData,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  // GET ALL ADDRESSES
  async findAddressesByUserId(userId: string) {
    const profile = await Profile.findOne({ userId }, { addresses: 1 });

    return profile?.addresses ?? [];
  }

  // GET ADDRESS BY ID
  async findAddressById(userId: string, addressId: string) {
    const profile = await Profile.findOne(
      {
        userId,
        "addresses._id": addressId,
      },
      {
        addresses: {
          $elemMatch: { _id: addressId },
        },
      },
    );

    return profile?.addresses?.[0] ?? null;
  }

  // UPDATE ADDRESS
  async updateAddress(
    userId: string,
    addressId: string,
    updateData: Partial<IAddress>,
  ) {
    const updateFields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(updateData)) {
      updateFields[`addresses.$.${key}`] = value;
    }

    const profile = await Profile.findOneAndUpdate(
      {
        userId,
        "addresses._id": addressId,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return (
      profile?.addresses.find(
        (address) => address.userId?.toString() === addressId,
      ) ?? null
    );
  }

  // DELETE ADDRESS
  async deleteAddress(userId: string, addressId: string) {
    return Profile.findOneAndUpdate(
      {
        userId,
        "addresses._id": addressId,
      },
      {
        $pull: {
          addresses: { _id: addressId },
        },
      },
      {
        new: true,
      },
    );
  }

  // SET DEFAULT ADDRESS
  async setDefaultAddress(userId: string, addressId: string) {
    // Reset all addresses
    await Profile.updateOne(
      { userId },
      {
        $set: {
          "addresses.$[].isDefault": false,
        },
      },
    );

    // Set selected address as default
    const profile = await Profile.findOneAndUpdate(
      {
        userId,
        "addresses._id": addressId,
      },
      {
        $set: {
          "addresses.$.isDefault": true,
        },
      },
      {
        new: true,
      },
    );

    return (
      profile?.addresses.find(
        (address) => address.userId?.toString() === addressId,
      ) ?? null
    );
  }
}

export const addressRepository = new AddressRepository();
