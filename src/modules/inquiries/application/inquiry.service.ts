import crypto from "crypto";
import { Inquiry, InquiryStatus } from "@/modules/inquiries/domain/inquiry";
import { InquiryRepository } from "@/modules/inquiries/contracts/inquiry.interfaces";
import { PropertyRepository } from "@/modules/properties/contracts/property.interfaces";
import { UserRepository } from "@/modules/users/contracts/user.interfaces";
import { CreateInquiryDTO } from "@/modules/inquiries/contracts/inquiry.schemas";
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq";
import { publishEvent } from "@/infrastructure/messaging/event-bus";
import {
  INQUIRY_RECEIVED,
  INQUIRY_RESPONDED,
  InquiryReceivedPayload,
  InquiryRespondedPayload,
} from "@/infrastructure/messaging/events";
import { notificationService } from "@/modules/notifications/notification.module";
import { sendEmail } from "@/infrastructure/email";
import { inquiryReceivedEmail, inquiryRespondedEmail } from "@/infrastructure/email/templates";
import CustomError from "@/shared/utils/custom-error";

export class InquiryService {
  constructor(
    private readonly inquiryRepo: InquiryRepository,
    private readonly propertyRepo: PropertyRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async createInquiry(senderId: string, dto: CreateInquiryDTO) {
    const property = await this.propertyRepo.findById(dto.propertyId);
    if (!property) throw new CustomError("Property not found", 404);

    if (property.ownerId === senderId) {
      throw new CustomError("You cannot send an inquiry on your own property", 400);
    }

    const inquiry = new Inquiry(
      crypto.randomUUID(),
      senderId,
      dto.propertyId,
      property.ownerId,
      dto.message,
    );

    const saved = await this.inquiryRepo.create(inquiry);

    // Publish inquiry received event
    const sender = await this.userRepo.findById(senderId);
    const recipient = await this.userRepo.findById(property.ownerId);
    const senderName = sender?.profile ? `${sender.profile.firstName} ${sender.profile.lastName}`.trim() : "User";
    const recipientName = recipient?.profile ? `${recipient.profile.firstName} ${recipient.profile.lastName}`.trim() : "User";

    const payload: InquiryReceivedPayload = {
      inquiryId: saved.id,
      senderId,
      senderName,
      senderEmail: sender?.email || "",
      recipientId: property.ownerId,
      recipientName,
      recipientEmail: recipient?.email || "",
      propertyTitle: property.title,
      message: dto.message,
    };

    if (rabbitMQ.isConnected()) {
      publishEvent("inquiry.received", {
        type: INQUIRY_RECEIVED,
        payload: payload as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: property.ownerId,
        type: "inquiry_received",
        title: "New Inquiry",
        message: `${senderName} sent an inquiry about "${property.title}".`,
        metadata: { inquiryId: saved.id, propertyTitle: property.title },
      });
      try {
        const template = inquiryReceivedEmail({
          recipientName,
          senderName,
          propertyTitle: property.title,
          message: dto.message,
        });
        await sendEmail({ to: recipient?.email || "", ...template });
      } catch (emailError) {
        console.error("Fallback email send failed:", emailError);
      }
    }

    return saved;
  }

  async getMyInquiries(userId: string, page = 1, limit = 20) {
    return this.inquiryRepo.findBySenderId(userId, page, limit);
  }

  async getReceivedInquiries(recipientId: string, page = 1, limit = 20) {
    return this.inquiryRepo.findByRecipientId(recipientId, page, limit);
  }

  async updateInquiryStatus(id: string, userId: string, status: string) {
    const inquiry = await this.inquiryRepo.findById(id);
    if (!inquiry) throw new CustomError("Inquiry not found", 404);

    if (inquiry.recipientId !== userId) {
      throw new CustomError("Only the property owner can update inquiry status", 403);
    }

    const previousStatus = inquiry.status;
    inquiry.status = status as InquiryStatus;
    const updated = await this.inquiryRepo.update(inquiry);

    // Publish inquiry responded event when status changes to responded
    if (status === InquiryStatus.RESPONDED && previousStatus !== InquiryStatus.RESPONDED) {
      const sender = await this.userRepo.findById(inquiry.senderId);
      const recipient = await this.userRepo.findById(inquiry.recipientId);
      const property = await this.propertyRepo.findById(inquiry.propertyId);
      const senderName = sender?.profile ? `${sender.profile.firstName} ${sender.profile.lastName}`.trim() : "User";
      const recipientName = recipient?.profile ? `${recipient.profile.firstName} ${recipient.profile.lastName}`.trim() : "User";

      const payload: InquiryRespondedPayload = {
        inquiryId: inquiry.id,
        senderId: inquiry.senderId,
        senderName,
        senderEmail: sender?.email || "",
        recipientId: inquiry.recipientId,
        recipientName,
        recipientEmail: recipient?.email || "",
        propertyTitle: property?.title || "Property",
      };

      if (rabbitMQ.isConnected()) {
        publishEvent("inquiry.responded", {
          type: INQUIRY_RESPONDED,
          payload: payload as unknown as Record<string, unknown>,
          timestamp: new Date().toISOString(),
        });
      } else {
        await notificationService.createNotification({
          userId: inquiry.senderId,
          type: "inquiry_responded",
          title: "Inquiry Responded",
          message: `${recipientName} responded to your inquiry about "${property?.title || "Property"}".`,
          metadata: { inquiryId: inquiry.id, propertyTitle: property?.title || "Property" },
        });
        try {
          const template = inquiryRespondedEmail({
            senderName,
            recipientName,
            propertyTitle: property?.title || "Property",
          });
          await sendEmail({ to: sender?.email || "", ...template });
        } catch (emailError) {
          console.error("Fallback email send failed:", emailError);
        }
      }
    }

    return updated;
  }
}
