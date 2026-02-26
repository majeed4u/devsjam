import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-lg border border-border/40 bg-card/50 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-2/3" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="divide-y divide-border/40 overflow-hidden rounded-lg border border-border/40 bg-card/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start justify-between p-6">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="ml-4 h-8 w-8 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
