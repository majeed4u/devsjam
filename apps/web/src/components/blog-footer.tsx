import { Link } from "@tanstack/react-router";
import { CommandIcon, Github, Linkedin, Twitter } from "lucide-react";

export function BlogFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-16 border-border/40 border-t bg-background/50 sm:mt-20">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				{/* Footer Content */}
				<div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="md:col-span-1">
						<div className="mb-4 flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<CommandIcon className="h-5 w-5" />
							</div>
							<span className="font-bold">DevJams</span>
						</div>
						<p className="text-foreground/60 text-sm">
							Sharing experiences, knowledge, and technical insights.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-4 font-semibold text-foreground text-sm">
							Navigation
						</h3>
						<ul className="space-y-2 text-foreground/60 text-sm">
							<li>
								<Link
									to="/"
									className="transition-colors duration-200 hover:text-foreground"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/blog"
									className="transition-colors duration-200 hover:text-foreground"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="transition-colors duration-200 hover:text-foreground"
								>
									About
								</Link>
							</li>
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h3 className="mb-4 font-semibold text-foreground text-sm">
							Categories
						</h3>
						<ul className="space-y-2 text-foreground/60 text-sm">
							<li>
								<a
									href="#"
									className="transition-colors duration-200 hover:text-foreground"
								>
									Technology
								</a>
							</li>
							<li>
								<a
									href="#"
									className="transition-colors duration-200 hover:text-foreground"
								>
									Development
								</a>
							</li>
							<li>
								<a
									href="#"
									className="transition-colors duration-200 hover:text-foreground"
								>
									Design
								</a>
							</li>
						</ul>
					</div>

					{/* Social Links */}
					<div>
						<h3 className="mb-4 font-semibold text-foreground text-sm">
							Follow
						</h3>
						<div className="flex gap-3">
							<a
								href="#"
								className="rounded-lg p-2 text-foreground/60 transition-all duration-200 hover:bg-accent hover:text-foreground"
								aria-label="GitHub"
							>
								<Github className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="rounded-lg p-2 text-foreground/60 transition-all duration-200 hover:bg-accent hover:text-foreground"
								aria-label="Twitter"
							>
								<Twitter className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="rounded-lg p-2 text-foreground/60 transition-all duration-200 hover:bg-accent hover:text-foreground"
								aria-label="LinkedIn"
							>
								<Linkedin className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="border-border/40 border-t pt-8">
					<p className="text-center text-foreground/50 text-sm">
						© {currentYear} DevJams. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
