import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("skeleton animate-pulse bg-muted", className)}
            {...props}
        />
    );
}

/**
 * Skeleton loader for Smart Cards
 */
function CardSkeleton() {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-8 w-32" />
            <div className="mt-2 flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-12 w-full" />
        </div>
    );
}

/**
 * Skeleton loader for charts
 */
function ChartSkeleton({ height = 300 }: { height?: number }) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="w-full rounded-lg" style={{ height }} />
        </div>
    );
}

/**
 * Skeleton loader for table rows
 */
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

export { Skeleton, CardSkeleton, ChartSkeleton, TableRowSkeleton };
