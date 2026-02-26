import { Skeleton } from "@/components/ui/skeleton";

export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
      <div className="divide-y divide-border/40">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-6 flex items-start justify-between group">
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton className="h-5 w-1/2" />
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="ml-4 flex gap-2 flex-shrink-0">
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
      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 bg-muted rounded animate-pulse" />
      <Skeleton className="w-full h-10 pl-10" />
    </div>
  );
}
