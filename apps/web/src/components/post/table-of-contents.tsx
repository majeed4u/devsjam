import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
	id: string;
	text: string;
	level: number;
}

interface TableOfContentsProps {
	headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		if (headings.length === 0) return;

		// Set initial active heading
		const observerOptions = {
			root: null,
			rootMargin: "-20% 0px -70% 0px", // Trigger when heading is in viewport
			threshold: 0,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveId(entry.target.id);
				}
			});
		}, observerOptions);

		// Observe all heading elements
		headings.forEach((heading) => {
			const element = document.getElementById(heading.id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => {
			headings.forEach((heading) => {
				const element = document.getElementById(heading.id);
				if (element) {
					observer.unobserve(element);
				}
			});
		};
	}, [headings]);

	if (headings.length === 0) {
		return null;
	}

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			const offset = 80; // Adjust for fixed header
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			// Update URL without jumping
			history.pushState(null, "", `#${id}`);
		}
	};

	return (
		<nav
			className="border-border/40 bg-card/50 sticky top-20 rounded-lg border p-4"
			aria-label="Table of Contents"
		>
			<h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-foreground/70">
				Contents
			</h3>
			<ul className="space-y-2">
				{headings.map((heading) => (
					<li
						key={heading.id}
						className={cn(
							"text-foreground/70 hover:text-primary transition-colors text-sm",
							heading.level === 3 && "pl-4",
							activeId === heading.id && "text-primary font-medium",
						)}
					>
						<a
							href={`#${heading.id}`}
							onClick={(e) => handleClick(e, heading.id)}
							className="block py-1"
						>
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

/**
 * Extract headings from HTML content
 */
export function extractHeadings(html: string): Heading[] {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = html;

	const headings: Heading[] = [];
	const headingElements = tempDiv.querySelectorAll("h2, h3");

	headingElements.forEach((element, index) => {
		const level = element.tagName === "H2" ? 2 : 3;
		const text = element.textContent || "";
		const id = element.id || `heading-${index}`;

		// Add ID to element if it doesn't have one
		if (!element.id) {
			element.id = id;
		}

		headings.push({
			id,
			text,
			level,
		});
	});

	return headings;
}
