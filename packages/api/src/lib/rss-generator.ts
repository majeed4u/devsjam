import { prisma } from "@devjams/db";

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  author?: string;
}

interface RSSFeedOptions {
  title: string;
  description: string;
  link: string;
  language?: string;
  items: RSSItem[];
}

/**
 * Generate RSS 2.0 XML feed
 */
export function generateRSSFeed(options: RSSFeedOptions): string {
  const { title, description, link, language = "en-us", items } = options;

  const itemsXML = items
    .map(
      (item) => `
    <item>
      <title>${escapeXML(item.title)}</title>
      <description>${escapeXML(item.description)}</description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.author ? `<author>${escapeXML(item.author)}</author>` : ""}
    </item>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(title)}</title>
    <description>${escapeXML(description)}</description>
    <link>${link}</link>
    <atom:link href="${link}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>${language}</language>
    ${itemsXML}
  </channel>
</rss>`;
}

/**
 * Fetch published posts and generate RSS feed
 */
export async function getPostsRSSFeed(baseUrl: string): Promise<string> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      archived: false,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50, // Last 50 posts
  });

  const items: RSSItem[] = posts.map((post) => {
    const description = post.excerpt
      ? post.excerpt
      : post.content?.slice(0, 200)?.replace(/[#*`]/g, "") || "";

    return {
      title: post.title,
      description,
      link: `${baseUrl}/blog/${post.slug}`,
      guid: `${baseUrl}/blog/${post.slug}`,
      pubDate: new Date(post.createdAt).toUTCString(),
      author: post.author.email,
    };
  });

  return generateRSSFeed({
    title: "DevJams",
    description: "A personal blog about DevOps, infrastructure, CI/CD, and reliability. Notes from the trenches.",
    link: baseUrl,
    language: "en-us",
    items,
  });
}

/**
 * Escape special XML characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
