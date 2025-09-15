import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <div className="rounded-md border">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-8 w-[200px]" />
        </div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="px-4 py-3">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
