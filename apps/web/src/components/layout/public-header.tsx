import { Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", to: "/" as const },
  { name: "Blog", to: "/" as const },
  { name: "About", to: "/" as const },
] as const;

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-6">
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-foreground">
                <Terminal className="h-4 w-4 text-background" />
              </div>
              <span className="text-lg font-sans font-semibold tracking-tight text-foreground">
                DevJams
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md transition-colors hover:text-foreground hover:bg-accent"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <ModeToggle />
            <Link to="/admin">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium"
              >
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>

      {/* Subtle border line */}
      <div className="h-px bg-border/60" />

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 transition-opacity duration-200",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-full max-w-xs bg-background border-l border-border shadow-xl transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 h-16">
            <Link
              to="/"
              className="flex items-center gap-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-foreground">
                <Terminal className="h-4 w-4 text-background" />
              </div>
              <span className="text-lg font-sans font-semibold tracking-tight text-foreground">
                DevJams
              </span>
            </Link>
            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="px-3 py-2.5 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
              <ModeToggle />
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="text-xs font-medium">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
