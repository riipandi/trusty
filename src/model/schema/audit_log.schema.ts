import { WithTimeStampSchema } from "@/model/client";
import { Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "audit_log";

export interface AuditLogTable extends WithTimeStampSchema {}

export type AuditLog = Selectable<AuditLogTable>;
export type InsertAuditLog = Insertable<AuditLogTable>;
export type UpdateAuditLog = Updateable<AuditLogTable>;
