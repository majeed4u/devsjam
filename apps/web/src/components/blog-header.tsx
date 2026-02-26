import { Link, Route } from "@tanstack/react-router";
import { CommandIcon, Menu, X } from "lucide-react";
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
  ] as const;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-border/40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
          : "border-transparent border-b bg-background/50"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CommandIcon className="h-5 w-5" />
          </div>
          <span className="hidden bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-transparent sm:inline">
            DevJams
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to as Route["path"]}
              className="group relative font-medium text-foreground/70 text-sm transition-colors duration-200 hover:text-foreground"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-accent"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fade-in slide-in-from-top-2 animate-in border-border/40 border-t bg-background/95 backdrop-blur-sm duration-200 md:hidden">
          <div className="space-y-2 px-4 py-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to as Route["path"]}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 font-medium text-foreground/70 text-sm transition-colors duration-200 hover:bg-accent hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 border-border/40 border-t pt-2">
              <div className="px-3 py-2">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
