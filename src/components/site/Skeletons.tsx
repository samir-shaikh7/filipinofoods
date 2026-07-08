export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-muted/40 ${className}`} />
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="rounded-[2rem] bg-white p-3 shadow-card ring-1 ring-black/[0.03] min-h-[320px]">
      <Skeleton className="aspect-square w-full rounded-[1.5rem]" />
      <div className="mt-4 space-y-3 px-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MenuSectionSkeleton() {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="h-px flex-1 bg-muted/30" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <MenuCardSkeleton key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
