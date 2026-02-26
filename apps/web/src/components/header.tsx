import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { orpc } from "@/utils/orpc";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} to={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<div>
						{healthCheck.data ? (
							<Lightbulb className="size-4 text-secondary" />
						) : (
							<LightbulbOff className="size-4 text-primary" />
						)}
					</div>
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
			<hr />
		</div>
	);
}
