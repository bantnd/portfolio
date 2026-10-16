// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

// https://astro.build/config
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
const siteUrl =
  env.SITE_URL ||
  env.RENDER_EXTERNAL_URL ||
  (env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : null) ||
  "http://localhost:4321";

export default defineConfig({
  site: siteUrl,
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "dark-plus",
    },
  },
});
