import { Report, ReportReason, ReportStatus } from "../../domain/report";
import { ReportOrmEntity } from "./report.orm-entity";

export class ReportMapper {
  static toDomain(entity: ReportOrmEntity): Report {
    return new Report(
      entity.id,
      entity.userId,
      entity.propertyId,
      entity.reason as ReportReason,
      entity.description,
      entity.status as ReportStatus,
      entity.reviewedBy,
      entity.reviewedAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(report: Report): ReportOrmEntity {
    const entity = new ReportOrmEntity();
    entity.id = report.id;
    entity.userId = report.userId;
    entity.propertyId = report.propertyId;
    entity.reason = report.reason;
    entity.description = report.description;
    entity.status = report.status;
    entity.reviewedBy = report.reviewedBy;
    entity.reviewedAt = report.reviewedAt;
    entity.createdAt = report.createdAt;
    entity.updatedAt = report.updatedAt;
    return entity;
  }
}
