import { Link } from "@tanstack/react-router";
import { CommandIcon, Github, Twitter, Linkedin } from "lucide-react";

export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/50 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <CommandIcon className="h-5 w-5" />
              </div>
              <span className="font-bold">DevJams</span>
            </div>
            <p className="text-sm text-foreground/60">
              Sharing experiences, knowledge, and technical insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Development
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Design
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Follow
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 pt-8">
          <p className="text-sm text-foreground/50 text-center">
            © {currentYear} DevJams. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
