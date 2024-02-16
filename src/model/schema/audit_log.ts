import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "audit_log";

export interface AuditLogTable {
  id: Generated<string>;
  payload: Object;
  ip_address: string;
  created_at: ColumnType<Date, number | undefined, never>;
}

export type AuditLog = Selectable<AuditLogTable>;
export type InsertAuditLog = Insertable<AuditLogTable>;
export type UpdateAuditLog = Updateable<AuditLogTable>;
