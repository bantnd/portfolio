// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const getValidSiteUrl = (...values) => {
  for (const value of values) {
    if (!value) continue;

    try {
      const url = new URL(value);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.toString().replace(/\/$/, "");
      }
    } catch {
      // Ignore invalid environment values and try the next candidate.
    }
  }

  return "http://localhost:4321";
};

const siteUrl = getValidSiteUrl(
  process.env.RENDER_EXTERNAL_URL,
  process.env.VERCEL_URL,
  process.env.SITE_URL,
);

// https://astro.build/config
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
