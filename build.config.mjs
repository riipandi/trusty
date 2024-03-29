#!/usr/bin/env node

/**
 * Build static frontend assets
 *  @ref: https://esbuild.github.io/getting-started/#bundling-for-node
 *  @ref: https://esbuild.github.io/api/#target
 *  @ref: https://oslo.js.org/reference/password
 */

import { build } from "esbuild";

await build({
  entryPoints: ["src/**/*.ts"],
  outdir: "dist",
  target: ["node20"],
  platform: "node",
  format: "esm",
  bundle: true,
  sourcemap: false,
  allowOverwrite: true,
  outExtension: { ".js": ".mjs" },
  minify: process.env.NODE_ENV === "production",
  drop: ["console", "debugger"],
  loader: { ".ts": "ts" },
  tsconfig: "tsconfig.json",
  packages: "external",
  alias: {
    "@/*": "./src/*",
  },
})
  .then(async () => {
    console.log("Project has been compiled successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Failed to compile: ${error}`);
    process.exit(1);
  });
