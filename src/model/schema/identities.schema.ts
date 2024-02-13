import { WithTimeStampSchema } from "@/model/client";
import { Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "identities";

export interface IdentitiesTable extends WithTimeStampSchema {}

export type Identities = Selectable<IdentitiesTable>;
export type InsertIdentities = Insertable<IdentitiesTable>;
export type UpdateIdentities = Updateable<IdentitiesTable>;
