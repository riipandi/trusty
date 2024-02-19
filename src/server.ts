#!/usr/bin/env -S deno run -A --watch=srv/,public/
// Copyright 2024 Aris Ripandi. Apache-2.0 license.

import { Hono } from 'hono/mod.ts';
import { csrf, etag, serveStatic } from 'hono/middleware.ts';
import { getPath } from 'hono/utils/url.ts';

import { GlobalEnv } from '@/global.d.ts';
import { logger } from '@/http/middleware/logger.ts';
import { onErrorResponse, throwResponse } from '@/http/response.ts';
import { db } from '@/model/client.ts';
import apiRoutes from '@/routes/api.ts';
import webRoutes from '@/routes/web.ts';

const app = new Hono<GlobalEnv>();

// Global middlewares
app.use('*', logger());
app.use('*', etag());
app.use('*', csrf({ origin: '*' }));

// Singleton context for database
app.use(async (c, next) => {
  c.set('db', db);
  await next();
});

// Error handling
app.notFound((c) => {
  // Check if it's an API request
  const path = getPath(c.req.raw);
  if (path.startsWith('/api')) {
    return throwResponse(c, 404, 'No route matched with those values');
  }
  return c.html('Not found', 404);
});

app.onError(onErrorResponse);

// Serve static files
app.use(
  '/assets/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/assets/, '/public'),
  }),
);
app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }));
app.use('/robots.txt', serveStatic({ path: './public/robots.txt' }));

// Register application routes
app.get('/', (c) => c.redirect('/ui', 302));
app.route('/api', apiRoutes);
app.route('/ui', webRoutes);

Deno.serve({ port: 3080, hostname: '0.0.0.0' }, app.fetch);
