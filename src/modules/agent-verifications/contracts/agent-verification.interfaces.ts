import { AgentVerification } from "../domain/agent-verification";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface AgentVerificationRepository {
  create(verification: AgentVerification): Promise<AgentVerification>;
  findById(id: string): Promise<AgentVerification | null>;
  findByUserId(userId: string): Promise<AgentVerification | null>;
  findAll(status: string | undefined, page: number, limit: number): Promise<PaginatedResult<AgentVerification>>;
  update(verification: AgentVerification): Promise<AgentVerification>;
}
