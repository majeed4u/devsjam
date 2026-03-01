import { useEffect } from "react";

interface PostMetaTagsProps {
  post: {
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    slug: string;
    createdAt: string;
    updatedAt: string;
    category?: {
      name: string;
    } | null;
    tags?: Array<{
      name: string;
    }> | null;
  };
}

/**
 * Update document meta tags for social sharing (Open Graph, Twitter Cards)
 */
export function PostMetaTags({ post }: PostMetaTagsProps) {
  useEffect(() => {
    // Update document title
    document.title = `${post.title} - DevJams`;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateMetaTagByName = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Basic Open Graph tags
    updateMetaTag("og:title", post.title);
    updateMetaTag("og:type", "article");
    updateMetaTag(
      "og:url",
      `${window.location.origin}/blog/${post.slug}`,
    );

    // Description (use excerpt or first 200 chars)
    const description = post.excerpt
      ? post.excerpt.slice(0, 200)
      : "DevOps, infrastructure, CI/CD, and reliability notes from the trenches.";
    updateMetaTag("og:description", description);
    updateMetaTagByName("twitter:description", description);

    // Site name
    updateMetaTag("og:site_name", "DevJams");

    // Image (use cover image or default)
    if (post.coverImage) {
      updateMetaTag("og:image", post.coverImage);
      updateMetaTagByName("twitter:image", post.coverImage);
    }

    // Twitter Card
    updateMetaTagByName("twitter:card", "summary_large_image");
    updateMetaTagByName("twitter:title", post.title);

    // Article-specific tags
    updateMetaTag("article:published_time", new Date(post.createdAt).toISOString());
    updateMetaTag("article:modified_time", new Date(post.updatedAt).toISOString());

    if (post.category) {
      updateMetaTag("article:section", post.category.name);
    }

    // Tags as article:tag
    post.tags?.forEach((tag) => {
      const tagElement = document.createElement("meta");
      tagElement.setAttribute("property", "article:tag");
      tagElement.setAttribute("content", tag.name);
      document.head.appendChild(tagElement);
    });

    // Cleanup function to remove dynamically added tags on unmount
    return () => {
      const dynamicTags = document.querySelectorAll(
        'meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"]',
      );
      dynamicTags.forEach((tag) => {
        // Keep tags that were statically defined
        const property = tag.getAttribute("property");
        const name = tag.getAttribute("name");

        // Remove only the article:tag elements we added
        if (property === "article:tag") {
          tag.remove();
        }
      });
    };
  }, [post]);

  // This component doesn't render anything
  return null;
}
