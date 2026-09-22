import { EmailChangeRequest } from "./email-change.model.js";
import { EmailChangeStatus } from "./email-change.constants.js";

export class EmailChangeRepository {
  async createEmailChangeRequest(data: {
    userId: string;
    oldEmail: string;
    newEmail: string;
    expiresAt: Date;
  }) {
    return EmailChangeRequest.create(data);
  }

  async findActiveRequestByUserId(userId: string) {
    return EmailChangeRequest.findOne({
      userId,
      status: {
        $in: [
          EmailChangeStatus.PENDING_OLD_EMAIL,
          EmailChangeStatus.PENDING_NEW_EMAIL,
        ],
      },
      expiresAt: {
        $gt: new Date(),
      },
    }).sort({ createdAt: -1 });
  }

  async findRequestById(requestId: string) {
    return EmailChangeRequest.findById(requestId);
  }

  async findPendingOldEmailRequest(userId: string) {
    return EmailChangeRequest.findOne({
      userId,
      status: EmailChangeStatus.PENDING_OLD_EMAIL,
      expiresAt: {
        $gt: new Date(),
      },
    }).sort({ createdAt: -1 });
  }

  async findPendingNewEmailRequest(userId: string) {
    return EmailChangeRequest.findOne({
      userId,
      status: EmailChangeStatus.PENDING_NEW_EMAIL,
      expiresAt: {
        $gt: new Date(),
      },
    }).sort({ createdAt: -1 });
  }

  async updateRequestStatus(requestId: string, status: EmailChangeStatus) {
    return EmailChangeRequest.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async markOldEmailVerified(requestId: string) {
    return EmailChangeRequest.findByIdAndUpdate(
      requestId,
      {
        $set: {
          oldEmailVerified: true,
          status: EmailChangeStatus.PENDING_NEW_EMAIL,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async markNewEmailVerified(requestId: string) {
    return EmailChangeRequest.findByIdAndUpdate(
      requestId,
      {
        $set: {
          newEmailVerified: true,
          status: EmailChangeStatus.COMPLETED,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async cancelActiveRequest(userId: string) {
    return EmailChangeRequest.updateMany(
      {
        userId,
        status: {
          $in: [
            EmailChangeStatus.PENDING_OLD_EMAIL,
            EmailChangeStatus.PENDING_NEW_EMAIL,
          ],
        },
      },
      {
        $set: {
          status: EmailChangeStatus.CANCELLED,
        },
      },
    );
  }
}

export const emailChangeRepository = new EmailChangeRepository();
