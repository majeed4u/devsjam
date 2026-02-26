import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Rss, Heart } from "lucide-react";

const footerLinks = {
  main: [
    { name: "Home", to: "/" as const },
    { name: "Blog", to: "/" as const },
    { name: "About", to: "/" as const },
  ],
  resources: [
    { name: "Projects", to: "/" as const },
    { name: "Contact", to: "/" as const },
  ],
};

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
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="inline-block">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  DevJams
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A personal blog where I share my experiences, learnings, and
                thoughts on software development and technology.
              </p>
            </div>

            {/* Main Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Navigation
              </h3>
              <ul className="space-y-3">
                {footerLinks.main.map((link) => (
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

            {/* Resources & Social */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Connect
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={social.name}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with <Heart className="inline h-4 w-4 text-red-500" /> by{" "}
            <Link to="/" className="text-foreground hover:text-primary">
              DevJams
            </Link>
            . &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
