import { Skeleton } from "@/components/ui/skeleton";

export function PostListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
			<div className="divide-y divide-border/40">
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className="group flex items-start justify-between p-6">
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-5 w-1/2" />
							<div className="flex flex-wrap gap-3 pt-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-16" />
							</div>
						</div>
						<div className="ml-4 flex flex-shrink-0 gap-2">
							<Skeleton className="h-8 w-8 rounded-lg" />
							<Skeleton className="h-8 w-8 rounded-lg" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function SearchBarSkeleton() {
	return (
		<div className="relative">
			<div className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 animate-pulse rounded bg-muted" />
			<Skeleton className="h-10 w-full pl-10" />
		</div>
	);
}
