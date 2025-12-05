import {
    ResponsiveContainer,
    AreaChart as RechartsAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    TooltipProps,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";

interface AreaChartProps {
    title: string;
    data: { date: string; value: number }[];
    loading?: boolean;
    height?: number;
    gradientColor?: string;
}

function CustomTooltip({
    active,
    payload,
    label,
}: TooltipProps<number, string>) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-card p-3 shadow-lg">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-lg font-bold text-primary">
                    {formatCurrency(payload[0].value as number)}
                </p>
            </div>
        );
    }
    return null;
}

export function AreaChart({
    title,
    data,
    loading = false,
    height = 300,
    gradientColor = "primary",
}: AreaChartProps) {
    if (loading) {
        return <ChartSkeleton height={height} />;
    }

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <RechartsAreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${gradientColor}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            opacity={0.3}
                        />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill={`url(#gradient-${gradientColor})`}
                        />
                    </RechartsAreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
