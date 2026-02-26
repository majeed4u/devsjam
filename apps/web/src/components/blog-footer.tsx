export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-border/40 border-t bg-background/50">
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <p className="text-foreground/50 text-sm">
          © {currentYear} DevJams. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
