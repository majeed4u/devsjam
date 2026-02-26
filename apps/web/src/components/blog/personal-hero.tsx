import { Github, Twitter, Linkedin, Mail, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

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
  bio = "I write about software development, share my experiences, and document my journey as a developer. Welcome to my corner of the internet where I explore technology and solve problems.",
  avatar,
  social,
}: PersonalHeroProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-muted/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-8 max-w-2xl">
          {/* Avatar */}
          {avatar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={avatar}
                alt={name}
                className="h-20 w-20 rounded-full ring-2 ring-border"
              />
            </motion.div>
          )}

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance leading-[1.1]">
              <span className="text-muted-foreground font-light italic font-serif">
                {"Hi, I'm "}
              </span>
              {name}
            </h1>
            <p className="text-lg text-muted-foreground font-sans font-medium">
              {title}
            </p>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-muted-foreground leading-relaxed font-sans"
          >
            {bio}
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 pt-2"
          >
            {social?.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {social?.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {social?.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {social?.email && (
              <a
                href={`mailto:${social.email}`}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}

            {/* Scroll indicator */}
            <div className="ml-auto hidden md:block">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
