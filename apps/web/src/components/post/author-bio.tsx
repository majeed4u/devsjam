import { Mail, Github, Twitter, Linkedin } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="h-20 w-20 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{name}</h3>
          <p className="text-foreground/70 text-sm mb-4">{bio}</p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="mailto:your@email.com"
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200 text-foreground/60 hover:text-foreground"
              title="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200 text-foreground/60 hover:text-foreground"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200 text-foreground/60 hover:text-foreground"
              title="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200 text-foreground/60 hover:text-foreground"
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
