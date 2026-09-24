import { Profile } from "../models/profile.model.js";
import type { IAddress } from "../types/address.types.js";

export class AddressRepository {
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

  async findAddressesByUserId(userId: string) {
    const profile = await Profile.findOne({ userId }, { addresses: 1 });

    return profile?.addresses ?? [];
  }

  async findAddressById(userId: string, addressId: string) {
    const profile = await Profile.findOne(
      {
        userId,
        "addresses._id": addressId,
      },
      {
        addresses: {
          $elemMatch: {
            _id: addressId,
          },
        },
      },
    );

    return profile?.addresses?.[0] ?? null;
  }

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
        (address) => address._id?.toString() === addressId,
      ) ?? null
    );
  }

  async deleteAddress(userId: string, addressId: string) {
    return Profile.findOneAndUpdate(
      {
        userId,
        "addresses._id": addressId,
      },
      {
        $pull: {
          addresses: {
            _id: addressId,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async setDefaultAddress(userId: string, addressId: string) {
    // First remove default from all addresses
    await Profile.updateOne(
      { userId },
      {
        $set: {
          "addresses.$[].isDefault": false,
        },
      },
    );

    // Then set the selected address as default
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
        runValidators: true,
      },
    );

    return (
      profile?.addresses.find(
        (address) => address._id?.toString() === addressId,
      ) ?? null
    );
  }

  async removeDefaultFromAllAddresses(userId: string) {
    return Profile.updateOne(
      { userId },
      {
        $set: {
          "addresses.$[].isDefault": false,
        },
      },
    );
  }
}

export const addressRepository = new AddressRepository();
