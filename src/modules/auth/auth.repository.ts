import { AuthUser } from "./auth.model.js";
import type { IAuthUser } from "./auth.types.js";

export class AuthRepository {
  // Register
  async createUser(userData: Partial<IAuthUser>) {
    const user = await AuthUser.create(userData);

    return user;
  }

  // Find user by email
  async findByEmail(email: string) {
    const user = await AuthUser.findOne({ email }).select("+password");

    return user;
  }

  // Find user by phone
  async findByPhone(phoneNumber: string) {
    const user = await AuthUser.findOne({ phoneNumber }).select("+password");

    return user;
  }

  // Find user by ID
  async findById(userId: string) {
    const user = await AuthUser.findById(userId);

    return user;
  }

  // Update user
  async updateUser(userId: string, updateData: Partial<IAuthUser>) {
    const user = await AuthUser.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    return user;
  }

  // Delete user
  async deleteUser(userId: string) {
    const user = await AuthUser.findByIdAndDelete(userId);

    return user;
  }

  // find email with passwordj
  async findByEmailWithPassword(email: string) {
    const user = await AuthUser.findOne({
      email,
    }).select("+password");

    return user;
  }

  // update password
  async updatePassword(userId: string, hashedPassword: string) {
    return AuthUser.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
          passwordChangedAt: new Date(),
        },
        $inc: {
          refreshTokenVersion: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  // change password
  async findByIdWithPassword(userId: string) {
    return AuthUser.findById(userId).select("+password");
  }

  // Temp delete account
  async temporaryDeleteAccount(userId: string) {
    return AuthUser.findByIdAndUpdate(
      userId,
      {
        $set: {
          isTemporaryDeletedUser: true,
          userTemporaryDeletedAt: new Date(),
        },
        $inc: {
          refreshTokenVersion: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  // RESTORE ACCOUNT
  async restoreAccount(userId: string) {
    return AuthUser.findByIdAndUpdate(
      userId,
      {
        $set: {
          isTemporaryDeletedUser: false,
          userTemporaryDeletedAt: null,
        },
        $inc: {
          refreshTokenVersion: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

export const authRepository = new AuthRepository();
