import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-semibold text-2xl text-foreground sm:text-3xl">
          About DevJams
        </h1>
        <p className="text-foreground/70 leading-relaxed">
          A personal blog about DevOps, infrastructure, CI/CD, and reliability.
          Notes from the trenches: Kubernetes, pipelines, observability, and
          making systems that stay up.
        </p>
      </section>
    </main>
  );
}

