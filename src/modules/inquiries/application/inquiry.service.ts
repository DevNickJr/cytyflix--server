import crypto from "crypto";
import { Inquiry, InquiryStatus } from "@/modules/inquiries/domain/inquiry";
import { InquiryRepository } from "@/modules/inquiries/contracts/inquiry.interfaces";
import { PropertyRepository } from "@/modules/properties/contracts/property.interfaces";
import { CreateInquiryDTO } from "@/modules/inquiries/contracts/inquiry.schemas";
import CustomError from "@/shared/utils/custom-error";

export class InquiryService {
  constructor(
    private readonly inquiryRepo: InquiryRepository,
    private readonly propertyRepo: PropertyRepository,
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

    return this.inquiryRepo.create(inquiry);
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

    inquiry.status = status as InquiryStatus;
    return this.inquiryRepo.update(inquiry);
  }
}
