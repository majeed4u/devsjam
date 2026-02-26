import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav className="flex items-center gap-1 text-foreground/60 text-sm">
			{items.map((item, index) => (
				<div key={item.href} className="flex items-center gap-1">
					<Link
						to={item.href}
						className="transition-colors duration-200 hover:text-foreground"
					>
						{item.label}
					</Link>
					{index < items.length - 1 && (
						<ChevronRight className="h-4 w-4 text-foreground/40" />
					)}
				</div>
			))}
		</nav>
	);
}
