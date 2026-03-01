import { Link, Route } from "@tanstack/react-router";
import { Menu, Rss, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export function BlogHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/search", label: "Search" },
  ] as const;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-border/30 border-b bg-background/90 backdrop-blur-sm"
          : "border-transparent border-b bg-background/70"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-medium text-foreground text-base hover:text-foreground/80"
        >
          DevJams
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to as Route["path"]}
              className="text-foreground/60 text-sm hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/search"
            className="rounded p-2 text-foreground/70 hover:bg-muted/50 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </a>
          <a
            href="/feed.xml"
            className="rounded p-2 text-foreground/70 hover:bg-muted/50 hover:text-foreground"
            aria-label="RSS Feed"
            title="Subscribe to RSS feed"
          >
            <Rss className="h-5 w-5" />
          </a>
          <ModeToggle />
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-foreground/70 hover:bg-muted/50 hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-border/30 border-t bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to as Route["path"]}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded px-3 py-2 text-foreground/70 text-sm hover:bg-muted/50 hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 border-border/30 border-t pt-2">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
