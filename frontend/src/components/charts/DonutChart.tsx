import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    TooltipProps,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ChartSkeleton } from "@/components/ui/Skeleton";

interface DonutChartProps {
    title: string;
    data: { name: string; value: number; percentage: number }[];
    loading?: boolean;
    height?: number;
}

const COLORS = [
    "hsl(221, 83%, 53%)",  // Primary blue
    "hsl(262, 83%, 58%)",  // Purple
    "hsl(142, 71%, 45%)",  // Green
    "hsl(38, 92%, 50%)",   // Amber
    "hsl(346, 77%, 50%)",  // Pink
    "hsl(199, 89%, 48%)",  // Cyan
];

function CustomTooltip({
    active,
    payload,
}: TooltipProps<number, string>) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-lg border bg-card p-3 shadow-lg">
                <p className="text-sm font-medium text-foreground">{data.name}</p>
                <p className="text-lg font-bold" style={{ color: payload[0].color }}>
                    {data.percentage.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                    {data.value.toLocaleString()} transactions
                </p>
            </div>
        );
    }
    return null;
}

export function DonutChart({
    title,
    data,
    loading = false,
    height = 300,
}: DonutChartProps) {
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
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-sm text-muted-foreground">{value}</span>
                            )}
                        />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
