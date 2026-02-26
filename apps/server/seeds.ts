import prisma from "@devjams/db";

export const posts = [
	{
		title: "Why I Chose Bun + Elysia for DevJams",
		slug: "why-i-chose-bun-elysia",
		excerpt:
			"Breaking down the architectural decisions behind choosing Bun and Elysia for a production-grade blog platform.",
		content: `
# Why I Chose Bun + Elysia

When building DevJams, I had two goals:

1. Performance
2. Developer experience

## Why Bun?

Bun provides:
- Extremely fast startup times
- Native TypeScript support
- Built-in bundler and runtime

Example:

\`\`\`ts
import { Elysia } from "elysia"

const app = new Elysia()
  .get("/", () => "Hello DevJams")
  .listen(3000)
\`\`\`

## Why Elysia?

Elysia is minimal, typed, and fast.

Compared to Express:
- Smaller footprint
- Better type inference
- Cleaner route definitions

## Conclusion

For a content-driven platform like DevJams, Bun + Elysia gives me full control without unnecessary abstraction.
`,
		readingTime: 6,
		published: true,
		views: 120,
		categorySlug: "backend",
		seriesSlug: "building-devjams",
		seriesOrder: 1,
		tagSlugs: ["bun", "elysia", "performance"],
	},

	{
		title: "Designing a Scalable Prisma Schema for a Blog",
		slug: "scalable-prisma-blog-schema",
		excerpt:
			"How to design a production-ready Prisma schema with tags, categories, and series support.",
		content: `
# Designing a Scalable Prisma Schema

Schema design is where most projects fail early.

## Core Models

- Post
- Tag
- Series
- Category

## Many-to-Many Done Right

In Prisma, implicit relations are perfect for blog tags:

\`\`\`prisma
model Post {
  tags Tag[]
}

model Tag {
  posts Post[]
}
\`\`\`

## Indexing Strategy

Important indexes:

- slug
- published
- createdAt
- seriesId + seriesOrder

## Final Thought

Keep schema simple. Add complexity only when needed.
`,
		readingTime: 8,
		published: true,
		views: 98,
		categorySlug: "backend",
		seriesSlug: "building-devjams",
		seriesOrder: 2,
		tagSlugs: ["prisma", "postgres", "architecture"],
	},

	{
		title: "Kubernetes From Zero: What It Actually Does",
		slug: "kubernetes-from-zero",
		excerpt:
			"A practical explanation of what Kubernetes really does in production environments.",
		content: `
# Kubernetes From Zero

Kubernetes is not magic.

It is a container orchestrator that handles:

- Scheduling
- Scaling
- Self-healing
- Networking

## Core Concepts

- Pods
- Deployments
- Services

Example deployment:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
\`\`\`

## Production Insight

Kubernetes shines when:
- You need scaling
- You need fault tolerance
- You manage multiple services

This is the foundation of modern infrastructure.
`,
		readingTime: 10,
		published: true,
		views: 210,
		categorySlug: "devops",
		seriesSlug: "kubernetes-from-scratch",
		seriesOrder: 1,
		tagSlugs: ["kubernetes", "devops"],
	},

	{
		title: "Preventing Double Jenkins Webhook Triggers",
		slug: "preventing-double-jenkins-triggers",
		excerpt:
			"How I debugged and fixed duplicate webhook builds in a mono-repo CI pipeline.",
		content: `
# Preventing Double Jenkins Triggers

If you're using a mono-repo, you may encounter double builds.

## Root Cause

- GitHub push triggers pipeline
- Tag update triggers pipeline again

## Fix Strategy

Use branch filtering and author checks.

Example:

\`\`\`groovy
when {
  not {
    buildingTag()
  }
}
\`\`\`

## Lesson Learned

CI pipelines must be carefully scoped in mono-repos.
`,
		readingTime: 6,
		published: true,
		views: 75,
		categorySlug: "devops",
		seriesSlug: "production-cicd",
		seriesOrder: 1,
		tagSlugs: ["jenkins", "ci-cd"],
	},

	{
		title: "External Kafka with TLS Passthrough Using Traefik",
		slug: "external-kafka-tls-traefik",
		excerpt:
			"Exposing Kafka externally using Traefik with TLS passthrough and cert-manager.",
		content: `
# External Kafka with TLS Passthrough

Exposing Kafka securely is not trivial.

## Architecture

- Strimzi
- Traefik IngressRouteTCP
- cert-manager with Vault

## TLS Passthrough

Traefik configuration:

\`\`\`yaml
spec:
  tls:
    passthrough: true
\`\`\`

## Key Takeaway

Always test with:
- Proper DNS
- Valid certificates
- Correct broker configuration

Secure messaging is critical in production systems.
`,
		readingTime: 13,
		published: true,
		views: 180,
		categorySlug: "devops",
		seriesSlug: null,
		seriesOrder: null,
		tagSlugs: ["kafka", "traefik", "tls", "kubernetes"],
	},
];

async function seed() {
	// 1️⃣ Create Categories
	await prisma.category.createMany({
		data: [
			{ name: "Backend", slug: "backend" },
			{ name: "DevOps", slug: "devops" },
		],
		skipDuplicates: true,
	});

	// 2️⃣ Create Series
	await prisma.series.createMany({
		data: [
			{ title: "Building DevJams", slug: "building-devjams" },
			{ title: "Kubernetes From Scratch", slug: "kubernetes-from-scratch" },
			{ title: "Production CI/CD", slug: "production-cicd" },
		],
		skipDuplicates: true,
	});

	// 3️⃣ Create Tags
	await prisma.tag.createMany({
		data: [
			{ name: "Bun", slug: "bun" },
			{ name: "Elysia", slug: "elysia" },
			{ name: "Performance", slug: "performance" },
			{ name: "Prisma", slug: "prisma" },
			{ name: "Postgres", slug: "postgres" },
			{ name: "Architecture", slug: "architecture" },
			{ name: "Kubernetes", slug: "kubernetes" },
			{ name: "DevOps", slug: "devops" },
			{ name: "Jenkins", slug: "jenkins" },
			{ name: "CI/CD", slug: "ci-cd" },
			{ name: "Kafka", slug: "kafka" },
			{ name: "Traefik", slug: "traefik" },
			{ name: "TLS", slug: "tls" },
		],
		skipDuplicates: true,
	});

	// 4️⃣ Now create posts
	for (const post of posts) {
		await prisma.post.create({
			data: {
				title: post.title,
				slug: post.slug,
				excerpt: post.excerpt,
				content: post.content,
				readingTime: post.readingTime,
				published: post.published,
				views: post.views,
				author: { connect: { id: "ljNlmyR2qsRNwxGYIFiOaqLG3zYCQ8eX" } },
				category: { connect: { slug: post.categorySlug } },
				series: post.seriesSlug
					? { connect: { slug: post.seriesSlug } }
					: undefined,
				seriesOrder: post.seriesOrder ?? undefined,
				tags: {
					create: post.tagSlugs.map((slug) => ({
						tag: { connect: { slug } },
					})),
				},
			},
		});
	}
}

seed()
	.then(() => {
		console.log("Seeding completed.");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Error seeding data:", error);
		process.exit(1);
	});
