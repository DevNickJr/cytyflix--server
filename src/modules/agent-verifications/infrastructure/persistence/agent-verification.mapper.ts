import { AgentVerification, VerificationStatus } from "../../domain/agent-verification";
import { AgentVerificationOrmEntity } from "./agent-verification.orm-entity";

export class AgentVerificationMapper {
  static toDomain(entity: AgentVerificationOrmEntity): AgentVerification {
    return new AgentVerification(
      entity.id,
      entity.userId,
      entity.idDocumentUrl,
      entity.selfieUrl,
      entity.status as VerificationStatus,
      entity.rejectionReason,
      entity.reviewedBy,
      entity.reviewedAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(verification: AgentVerification): AgentVerificationOrmEntity {
    const entity = new AgentVerificationOrmEntity();
    entity.id = verification.id;
    entity.userId = verification.userId;
    entity.idDocumentUrl = verification.idDocumentUrl;
    entity.selfieUrl = verification.selfieUrl;
    entity.status = verification.status;
    entity.rejectionReason = verification.rejectionReason;
    entity.reviewedBy = verification.reviewedBy;
    entity.reviewedAt = verification.reviewedAt;
    entity.createdAt = verification.createdAt;
    entity.updatedAt = verification.updatedAt;
    return entity;
  }
}
