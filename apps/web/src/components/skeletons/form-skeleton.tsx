import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2 opacity-50" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Full width editor area */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <article className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3 opacity-50" />
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Cover image */}
      <Skeleton className="w-full h-96 rounded-lg" />

      {/* Content */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-5 w-full ${i % 3 === 2 ? "w-5/6" : ""}`}
          />
        ))}
      </div>

      {/* Share buttons */}
      <div className="flex gap-2 pt-4 border-t border-border/40">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </article>
  );
}
