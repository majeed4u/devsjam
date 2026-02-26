import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import type { Post } from "@/types/post";

export const PostView = ({ post }: { post: Post }) => {
  const [html, setHtml] = useState(post.content);
  // handle copy code block to clipboard
  useEffect(() => {
    async function highlight() {
      const highlighter = await createHighlighter({
        themes: ["material-theme-darker"],
        langs: ["ts", "js", "tsx", "jsx", "yaml", "sh", "html", "bash"],
      });

      // Merge consecutive <p><code>...</code></p> lines into a single <pre><code> block
      const merged = post.content.replace(
        /(<p><code>[^<]*<\/code><\/p>\s*)+/g,
        (match) => {
          const lines = [
            ...match.matchAll(/<p><code>(.*?)<\/code><\/p>/gs),
          ].map(([, line]) => line);
          return `<pre><code>${lines.join("\n")}</code></pre>`;
        },
      );

      const highlighted = merged.replace(
        /<pre><code(?:\s+class="language-([\w-]+)")?>(.*?)<\/code><\/pre>/gs,
        (_, lang, code) => {
          const decoded = code
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");
          return highlighter.codeToHtml(decoded, {
            lang: lang || "text",
            theme: "material-theme-darker",
          });
        },
      );

      setHtml(highlighted);
    }

    highlight();
  }, [post.content]);

  return (
    <article className="prose dark:prose-invert mx-auto my-6">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};
