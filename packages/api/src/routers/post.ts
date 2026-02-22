import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index";

export const postRouter = {
  getPosts: publicProcedure.handler(() => {
    return [
      {
        id: "1",
        title: "Why I Chose Bun + Elysia",
        slug: "why-i-chose-bun-elysia",
        excerpt: "Performance + dev experience with Bun + Elysia",
        content: `<h3>Bun + Elysia are great.</h3>
<pre><code class="language-ts">import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello DevJams")
  .listen(3000);
</code></pre>`,
        readingTime: 6,
        published: true,
        categorySlug: "backend",
        seriesSlug: "building-devjams",
        tagSlugs: ["bun", "elysia", "performance"],
      },
      {
        id: "2",
        title: "Building DevJams with Elysia",
        slug: "building-devjams-with-elysia",
        excerpt: "How we built DevJams with Elysia",
        content: `<h3>We built DevJams with Elysia.</h3>
<pre><code class="language-ts">import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello DevJams")
  .listen(3000);
</code></pre> 

<h1>Why Elysia?</h1>

<p>We chose Elysia for its performance and developer experience. It allowed us to build a fast and efficient backend for DevJams, while also providing a great developer experience.</p>

<ol>
<li>Performance: Elysia is built on top of Bun, which is known for its high performance. This allows us to serve our content quickly and efficiently.</li>
<li>Developer Experience: Elysia has a great developer experience, with a simple and intuitive API. This made it easy for us to build and maintain our backend.</li>    
</ol>
<pre><code class="language-yaml">apiVersion: v1
kind: Service
metadata:
  name: devjams-backend
spec:
  selector:
    app: devjams-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
</code></pre>

<a href="#top">Back to top</a>

// Quote

<blockquote>
<p>Performance is key for a great user experience, and Elysia delivers on that front.</p>
</blockquote>

`,
        readingTime: 8,
        published: true,
        categorySlug: "backend",
        seriesSlug: "building-devjams",
        tagSlugs: ["elysia", "devjams", "performance"],
      },
      // ✅ add more posts here as needed
    ];
  }),
};

export type PostRouter = typeof postRouter;
export type PostRouterClient = RouterClient<typeof postRouter>;
