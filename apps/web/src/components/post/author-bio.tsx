import { Github, Linkedin, Mail, Twitter } from "lucide-react";

interface AuthorBioProps {
  name?: string;
  bio?: string;
  avatar?: string;
}

export function AuthorBio({
  name = "Your Name",
  bio = "I'm passionate about building software and sharing knowledge.",
  avatar,
}: AuthorBioProps) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/50 p-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="mb-2 font-bold text-lg">{name}</h3>
          <p className="mb-4 text-foreground/70 text-sm">{bio}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:your@email.com"
              className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
              title="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
              title="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
