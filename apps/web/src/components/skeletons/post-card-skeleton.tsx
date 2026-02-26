import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/40 bg-card/50">
			<Skeleton className="h-48 w-full" />
			<div className="flex flex-1 flex-col space-y-3 p-4">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<div className="mt-auto flex gap-2 pt-2">
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-20" />
				</div>
			</div>
		</div>
	);
}

export function PostCardGridSkeleton({ count = 3 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }).map((_, i) => (
				<PostCardSkeleton key={i} />
			))}
		</div>
	);
}
