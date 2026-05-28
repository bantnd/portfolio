import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const staticRoutes = [
  "/",
  "/projects/",
  "/projects/realtime-data-sync/",
  "/projects/zero-trust-soc/",
  "/projects/kubernetes-cluster/",
  "/projects/image-converter/",
  "/blog/",
  "/contact/",
  "/cv/",
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site, url }) => {
  const siteURL = site ?? new URL(url.origin);
  const posts = await getCollection("blog");

  const urls = [
    ...staticRoutes.map((path) => ({ loc: new URL(path, siteURL).toString() })),
    ...posts.map((post) => ({
      loc: new URL(`/blog/${post.id}/`, siteURL).toString(),
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
