import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

interface AuthorBioProps {
  name?: string;
  bio?: string;
  avatar?: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export function AuthorBio({
  name = "DevJams",
  bio = "Software developer passionate about building elegant solutions and sharing knowledge with the community.",
  avatar,
  social,
}: AuthorBioProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="my-12">
      <Separator className="mb-8" />
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Avatar */}
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-lg sm:text-xl font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Bio Content */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Written by {name}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{bio}</p>

          {/* Social Links */}
          {social && (
            <div className="flex gap-3 pt-2">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <Separator className="mt-8" />
    </div>
  );
}
