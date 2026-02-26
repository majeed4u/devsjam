import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-bold text-4xl">About DevJams</h1>
        <p className="text-foreground/70 text-lg leading-relaxed">
          Sharing experiences, knowledge, and technical insights about web
          development, software architecture, and building products that matter.
        </p>
      </section>
    </main>
  );
}

