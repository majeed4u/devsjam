export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-border/30 border-t">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-foreground/50 text-sm">
          © {currentYear} DevJams — a personal blog about DevOps and
          infrastructure.
        </p>
      </div>
    </footer>
  );
}
