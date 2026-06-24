import { Report } from "../domain/report";
import { PaginatedResult } from "@/modules/properties/contracts/property.interfaces";

export interface ReportRepository {
  create(report: Report): Promise<Report>;
  findById(id: string): Promise<Report | null>;
  findAll(status: string | undefined, page: number, limit: number): Promise<PaginatedResult<Report>>;
  update(report: Report): Promise<Report>;
}
