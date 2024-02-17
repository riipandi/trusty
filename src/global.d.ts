import { type HttpBindings } from "@hono/node-server";
import { KyselyDatabase } from "@/model/client";

export type Bindings = HttpBindings & {};

export type GlobalEnv = {
  Bindings: Bindings;
  Variables: {
    db: KyselyDatabase;
  };
};
