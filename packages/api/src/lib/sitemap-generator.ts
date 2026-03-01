import { prisma } from "@devjams/db";

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Generate XML sitemap
 */
export function generateSitemap(baseUrl: string, urls: SitemapURL[]): string {
  const urlXML = urls
    .map(
      (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlXML}
</urlset>`;
}

/**
 * Generate sitemap for all blog content
 */
export async function getBlogSitemap(baseUrl: string): Promise<string> {
  const urls: SitemapURL[] = [
    // Static pages
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/blog", changefreq: "daily", priority: 0.9 },
    { loc: "/about", changefreq: "monthly", priority: 0.5 },
    { loc: "/search", changefreq: "weekly", priority: 0.6 },
  ];

  // Get all published posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      archived: false,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Add posts to sitemap
  for (const post of posts) {
    urls.push({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  for (const category of categories) {
    urls.push({
      loc: `/blog/category/${category.slug}`,
      lastmod: category.updatedAt.toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  // Get all tags
  const tags = await prisma.tag.findMany({
    select: {
      slug: true,
    },
  });

  for (const tag of tags) {
    urls.push({
      loc: `/blog/tag/${tag.slug}`,
      changefreq: "weekly",
      priority: 0.6,
    });
  }

  // Get all series
  const series = await prisma.series.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  for (const s of series) {
    urls.push({
      loc: `/blog/series/${s.slug}`,
      lastmod: s.updatedAt.toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  return generateSitemap(baseUrl.replace(/\/$/, ""), urls);
}
