import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site, url }) => {
  const siteURL = site ?? new URL(url.origin);
  const sitemapURL = new URL("/sitemap.xml", siteURL);

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
