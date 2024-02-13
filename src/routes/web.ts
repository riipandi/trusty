import { Hono } from "hono";
import { html, raw } from "hono/html";

import { Bindings } from "@/binding";

const route = new Hono<{ Bindings: Bindings }>();

route.get("/", (c) => {
  const message = "This is will be replaced wit the UI!";

  return c.html(html`<html>
  <head>
    <meta charset="UTF-8">
    <title>Trusty</title>
    <meta name="description" content="Trusty authentication server">
  </head>
  <body>
    <h1>${raw(message)}</h1>
    <my-element></my-element>
  </body>
  </html>
      `);
});

export default route;
