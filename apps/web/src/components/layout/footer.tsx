import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Rss, Terminal } from "lucide-react";

const footerLinks = [
  { name: "Home", to: "/" as const },
  { name: "Blog", to: "/" as const },
  { name: "About", to: "/" as const },
  { name: "Projects", to: "/" as const },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
  },
  {
    name: "RSS",
    href: "/rss",
    icon: Rss,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <div className="py-16">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            {/* Brand */}
            <div className="flex flex-col gap-4 max-w-sm">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-foreground">
                  <Terminal className="h-4 w-4 text-background" />
                </div>
                <span className="text-lg font-sans font-semibold tracking-tight text-foreground">
                  DevJams
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thoughts on software development, technology, and the craft of
                building things for the web.
              </p>
            </div>

            {/* Links & Social */}
            <div className="flex gap-16">
              {/* Navigation */}
              <div>
                <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Navigate
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {footerLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Connect
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <li key={social.name}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={social.name}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{social.name}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} DevJams. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
