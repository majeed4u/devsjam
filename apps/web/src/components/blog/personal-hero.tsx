import { Github, Twitter, Linkedin, Mail } from "lucide-react";

interface PersonalHeroProps {
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export function PersonalHero({
  name = "DevJams",
  title = "Software Developer & Technical Writer",
  bio = "I write about software development, share my experiences, and document my journey as a developer. Welcome to my personal blog where I explore technology, solve problems, and learn along the way.",
  avatar,
  social,
}: PersonalHeroProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Avatar */}
          {avatar && (
            <div className="flex justify-center">
              <img
                src={avatar}
                alt={name}
                className="h-32 w-32 rounded-full border-4 border-background shadow-lg"
              />
            </div>
          )}

          {/* Name & Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Hi, I'm {name}
            </h1>
            <p className="text-xl text-muted-foreground">{title}</p>
          </div>

          {/* Bio */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              {bio}
            </p>
          </div>

          {/* Social Links */}
          {social && (
            <div className="flex justify-center gap-4">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-foreground"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-foreground"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-sm font-medium">Email</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
