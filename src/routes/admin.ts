import { Hono } from "hono";

import { Bindings } from "@/global";

const route = new Hono<{ Bindings: Bindings }>();

route.get("/", (c) => c.text("This is will be replaced wit the admin dashboard"));

export default route;
