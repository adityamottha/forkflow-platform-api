import { ProfileHistory } from "../models/profileHistory.model.js";
import {
  ProfileHistoryField,
  type IProfileHistory,
} from "../types/profileHistory.types.js";

export class ProfileHistoryRepository {
  async createHistory(historyData: Partial<IProfileHistory>) {
    return ProfileHistory.create(historyData);
  }

  async findByUserId(userId: string) {
    return ProfileHistory.find({ userId }).sort({
      changedAt: -1,
    });
  }

  async findByUserIdAndField(userId: string, field: ProfileHistoryField) {
    return ProfileHistory.find({
      userId,
      field,
    }).sort({
      changedAt: -1,
    });
  }

  async findLatestByField(userId: string, field: ProfileHistoryField) {
    return ProfileHistory.findOne({
      userId,
      field,
    }).sort({
      changedAt: -1,
    });
  }

  async deleteUserHistory(userId: string) {
    return ProfileHistory.deleteMany({
      userId,
    });
  }
}

export const profileHistoryRepository = new ProfileHistoryRepository();
