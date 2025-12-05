import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { cn, formatPercent, getTrendColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPIMetric } from "@/lib/api";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface SmartCardProps {
    title: string;
    metric: KPIMetric;
    icon?: React.ReactNode;
    sparklineData?: { value: number }[];
    loading?: boolean;
}

/**
 * Smart KPI Card with trend indicator and optional sparkline
 */
export function SmartCard({
    title,
    metric,
    icon,
    sparklineData,
    loading = false,
}: SmartCardProps) {
    if (loading) {
        return <CardSkeleton />;
    }

    const TrendIcon =
        metric.trend === "up"
            ? TrendingUp
            : metric.trend === "down"
                ? TrendingDown
                : Minus;

    const badgeVariant =
        metric.trend === "up"
            ? "success"
            : metric.trend === "down"
                ? "destructive"
                : "outline";

    return (
        <Card className="glass-card transition-all hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{metric.formatted_value}</div>
                <div className="flex items-center gap-2 mt-2">
                    <span className={cn("text-sm", getTrendColor(metric.trend || "stable"))}>
                        <TrendIcon className="inline h-4 w-4 mr-1" />
                        {metric.change_percent !== undefined
                            ? formatPercent(metric.change_percent)
                            : "—"}
                    </span>
                    <Badge variant={badgeVariant}>vs last month</Badge>
                </div>
                {sparklineData && sparklineData.length > 0 && (
                    <div className="mt-4 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sparklineData}>
                                <defs>
                                    <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="url(#sparklineGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
