import { Hono } from 'hono/mod.ts';
import { html, raw } from 'hono/helper/html/index.ts';
import { GlobalEnv } from '@/global.d.ts';

const route = new Hono<GlobalEnv>();

route.get('/', (c) => {
  const message = 'This is will be replaced wit the UI!';
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
