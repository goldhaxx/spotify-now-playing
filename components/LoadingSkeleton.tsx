import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="space-y-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-[350px] w-[350px]" />
        <Skeleton className="h-[350px] w-[350px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[350px] w-[350px]" />
        <Skeleton className="h-[150px] w-[350px]" />
      </div>
    </div>
  )
}
