import { createFileRoute } from "@tanstack/react-router";import { createFileRoute } from '@tanstack/react-router'



















}  );    </main>      </section>        </p>          development, software architecture, and building products that matter.          Sharing experiences, knowledge, and technical insights about web        <p className="text-foreground/70 text-lg leading-relaxed">        <h1 className="font-bold text-4xl">About DevJams</h1>      <section className="mx-auto max-w-3xl space-y-6">    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">  return (function AboutPage() {});  component: AboutPage,export const Route = createFileRoute("/about")({
export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about"!</div>
}
