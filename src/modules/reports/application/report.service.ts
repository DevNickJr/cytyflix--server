import crypto from "crypto";
import { Report, ReportStatus } from "../domain/report";
import { ReportRepository } from "../contracts/report.interfaces";
import { CreateReportDTO, ReviewReportDTO } from "../contracts/report.schemas";
import CustomError from "@/shared/utils/custom-error";

export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository,
  ) {}

  async create(userId: string, propertyId: string, dto: CreateReportDTO) {
    const report = new Report(
      crypto.randomUUID(),
      userId,
      propertyId,
      dto.reason as any,
      dto.description,
    );

    return this.reportRepo.create(report);
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
