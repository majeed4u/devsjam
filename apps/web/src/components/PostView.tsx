import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import type { Post } from "../../../../packages/db/prisma/generated/client";

export const PostView = ({ post }: { post: Post }) => {
  const [html, setHtml] = useState(post.content);
  // handle copy code block to clipboard
  useEffect(() => {
    async function highlight() {
      const highlighter = await createHighlighter({
        themes: ["nord"],
        langs: ["ts", "js", "tsx", "jsx", "yaml", "sh", "html", "bash"],
      });

      const highlighted = post.content.replace(
        /<pre><code class="language-(.*?)">(.*?)<\/code><\/pre>/gs,
        (_, lang, code) => {
          const decoded = code
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");
          return highlighter.codeToHtml(decoded, {
            lang,
            theme: "nord",
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
