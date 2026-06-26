import crypto from "crypto";
import { AgentVerification, VerificationStatus } from "../domain/agent-verification";
import { AgentVerificationRepository } from "../contracts/agent-verification.interfaces";
import { SubmitVerificationDTO, ReviewVerificationDTO } from "../contracts/agent-verification.schemas";
import { UserRepository, RolesEnum } from "@/modules/users/contracts/user.interfaces";
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq";
import { publishEvent } from "@/infrastructure/messaging/event-bus";
import {
  VERIFICATION_APPROVED,
  VERIFICATION_REJECTED,
  VerificationApprovedPayload,
  VerificationRejectedPayload,
} from "@/infrastructure/messaging/events";
import { notificationService } from "@/modules/notifications/notification.module";
import { sendEmail } from "@/infrastructure/email";
import { verificationApprovedEmail, verificationRejectedEmail } from "@/infrastructure/email/templates";
import CustomError from "@/shared/utils/custom-error";

export class AgentVerificationService {
  constructor(
    private readonly verificationRepo: AgentVerificationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async submit(userId: string, dto: SubmitVerificationDTO) {
    const existing = await this.verificationRepo.findByUserId(userId);
    if (existing && existing.status === VerificationStatus.PENDING) {
      throw new CustomError("You already have a pending verification request", 400);
    }
    if (existing && existing.status === VerificationStatus.APPROVED) {
      throw new CustomError("You are already a verified agent", 400);
    }

    // If rejected, allow resubmission by updating existing
    if (existing && existing.status === VerificationStatus.REJECTED) {
      existing.idDocumentUrl = dto.idDocumentUrl;
      existing.selfieUrl = dto.selfieUrl;
      existing.status = VerificationStatus.PENDING;
      existing.rejectionReason = undefined;
      existing.reviewedBy = undefined;
      existing.reviewedAt = undefined;
      return this.verificationRepo.update(existing);
    }

    const verification = new AgentVerification(
      crypto.randomUUID(),
      userId,
      dto.idDocumentUrl,
      dto.selfieUrl,
    );

    return this.verificationRepo.create(verification);
  }

  async review(verificationId: string, reviewerId: string, dto: ReviewVerificationDTO) {
    const verification = await this.verificationRepo.findById(verificationId);
    if (!verification) throw new CustomError("Verification not found", 404);
    if (verification.status !== VerificationStatus.PENDING) {
      throw new CustomError("This verification has already been reviewed", 400);
    }

    verification.status = dto.status as VerificationStatus;
    verification.reviewedBy = reviewerId;
    verification.reviewedAt = new Date();

    const user = await this.userRepo.findById(verification.userId);
    const userName = user?.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : "User";
    const userEmail = user?.email || "";

    if (dto.status === "approved") {
      if (user) {
        user.role = RolesEnum.AGENT;
        await this.userRepo.update(user);
      }

      const payload: VerificationApprovedPayload = {
        verificationId: verification.id,
        userId: verification.userId,
        userName,
        userEmail,
      };

      if (rabbitMQ.isConnected()) {
        publishEvent("verification.approved", {
          type: VERIFICATION_APPROVED,
          payload: payload as unknown as Record<string, unknown>,
          timestamp: new Date().toISOString(),
        });
      } else {
        await notificationService.createNotification({
          userId: verification.userId,
          type: "system",
          title: "Verification Approved",
          message: "Your agent verification has been approved. You can now operate as an agent on CytyFlix.",
          metadata: { verificationId: verification.id },
        });
        try {
          const template = verificationApprovedEmail({ agentName: userName });
          await sendEmail({ to: userEmail, ...template });
        } catch (emailError) {
          console.error("Fallback email send failed:", emailError);
        }
      }
    } else {
      verification.rejectionReason = dto.rejectionReason;
      const reason = dto.rejectionReason || "Not specified";

      const payload: VerificationRejectedPayload = {
        verificationId: verification.id,
        userId: verification.userId,
        userName,
        userEmail,
        reason,
      };

      if (rabbitMQ.isConnected()) {
        publishEvent("verification.rejected", {
          type: VERIFICATION_REJECTED,
          payload: payload as unknown as Record<string, unknown>,
          timestamp: new Date().toISOString(),
        });
      } else {
        await notificationService.createNotification({
          userId: verification.userId,
          type: "system",
          title: "Verification Rejected",
          message: `Your agent verification was rejected. Reason: ${reason}`,
          metadata: { verificationId: verification.id },
        });
        try {
          const template = verificationRejectedEmail({ agentName: userName, reason });
          await sendEmail({ to: userEmail, ...template });
        } catch (emailError) {
          console.error("Fallback email send failed:", emailError);
        }
      }
    }

    return this.verificationRepo.update(verification);
  }

  async getMyVerification(userId: string) {
    return this.verificationRepo.findByUserId(userId);
  }

  async getAll(status: string | undefined, page: number, limit: number) {
    return this.verificationRepo.findAll(status, page, limit);
  }

  async getOne(id: string) {
    const verification = await this.verificationRepo.findById(id);
    if (!verification) throw new CustomError("Verification not found", 404);
    return verification;
  }
}
