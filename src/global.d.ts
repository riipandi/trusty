import { KyselyDatabase } from "@/model/client";
import { type HttpBindings } from "@hono/node-server";

export type Bindings = HttpBindings & {};

export type GlobalEnv = {
  Bindings: Bindings;
  Variables: {
    db: KyselyDatabase;
  };
};
