import crypto from "crypto";
import { Report, ReportStatus } from "../domain/report";
import { ReportRepository } from "../contracts/report.interfaces";
import { CreateReportDTO, ReviewReportDTO } from "../contracts/report.schemas";
import { PropertyRepository } from "@/modules/properties/contracts/property.interfaces";
import { UserRepository } from "@/modules/users/contracts/user.interfaces";
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq";
import { publishEvent } from "@/infrastructure/messaging/event-bus";
import { PROPERTY_FROZEN, PropertyFrozenPayload } from "@/infrastructure/messaging/events";
import { notificationService } from "@/modules/notifications/notification.module";
import { sendEmail } from "@/infrastructure/email";
import { propertyFrozenEmail } from "@/infrastructure/email/templates";
import CustomError from "@/shared/utils/custom-error";

const AUTO_FREEZE_THRESHOLD = 3;

export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly propertyRepo: PropertyRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(userId: string, propertyId: string, dto: CreateReportDTO) {
    const report = new Report(
      crypto.randomUUID(),
      userId,
      propertyId,
      dto.reason as any,
      dto.description,
    );

    const saved = await this.reportRepo.create(report);

    // Auto-freeze: check if property has reached the threshold of unique reporters
    const uniqueReporters = await this.reportRepo.countUniqueReporters(propertyId);
    if (uniqueReporters >= AUTO_FREEZE_THRESHOLD) {
      const property = await this.propertyRepo.findById(propertyId);
      if (property && !property.isFrozen) {
        property.isAvailable = false;
        property.isFrozen = true;
        property.frozenReason = `Auto-frozen: ${uniqueReporters} unique reports received`;
        await this.propertyRepo.update(property);

        // Look up owner info for notifications
        const owner = await this.userRepo.findById(property.ownerId);
        const ownerName = owner?.profile ? `${owner.profile.firstName} ${owner.profile.lastName}`.trim() : "Property Owner";
        const ownerEmail = owner?.email || "";

        const payload: PropertyFrozenPayload = {
          propertyId,
          ownerId: property.ownerId,
          ownerName,
          ownerEmail,
          propertyTitle: property.title,
          reason: property.frozenReason,
        };

        if (rabbitMQ.isConnected()) {
          publishEvent("property.frozen", {
            type: PROPERTY_FROZEN,
            payload: payload as unknown as Record<string, unknown>,
            timestamp: new Date().toISOString(),
          });
        } else {
          // Fallback: direct notification + email
          await notificationService.createNotification({
            userId: property.ownerId,
            type: "system",
            title: "Property Listing Frozen",
            message: `Your listing "${property.title}" has been frozen due to multiple reports and is under review.`,
            metadata: { propertyId },
          });
          try {
            if (ownerEmail) {
              const template = propertyFrozenEmail({
                ownerName,
                propertyTitle: property.title,
                reason: property.frozenReason,
              });
              await sendEmail({ to: ownerEmail, ...template });
            }
          } catch (emailError) {
            console.error("Fallback email send failed:", emailError);
          }
        }
      }
    }

    return saved;
  }

  async getAll(status: string | undefined, page: number, limit: number) {
    return this.reportRepo.findAll(status, page, limit);
  }

  async review(reportId: string, reviewerId: string, dto: ReviewReportDTO) {
    const report = await this.reportRepo.findById(reportId);
    if (!report) throw new CustomError("Report not found", 404);
    if (report.status !== ReportStatus.PENDING) {
      throw new CustomError("This report has already been reviewed", 400);
    }

    report.status = dto.status as ReportStatus;
    report.reviewedBy = reviewerId;
    report.reviewedAt = new Date();

    return this.reportRepo.update(report);
  }
}
