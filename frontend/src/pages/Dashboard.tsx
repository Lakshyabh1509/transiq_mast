import { Link } from "react-router-dom";
import { SmartCard } from "@/components/ui/SmartCard";
import { AreaChart } from "@/components/charts/AreaChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
    useKPIs,
    useRevenueTrend,
    usePaymentMethods,
} from "@/hooks/useDashboard";
import { useAuth } from "@/context/AuthContext";
import {
    DollarSign,
    Users,
    TrendingDown,
    Activity,
    Upload,
    Plus,
    Info,
} from "lucide-react";

export function Dashboard() {
    const { user } = useAuth();
    const isDemo = user?.id?.startsWith("demo-");
    const { data: kpis, isLoading: kpisLoading } = useKPIs();
    const { data: revenueTrend, isLoading: trendLoading } = useRevenueTrend(30);
    const { data: paymentMethods, isLoading: paymentsLoading } = usePaymentMethods();

    // Create sparkline data from revenue trend
    const sparklineData = revenueTrend?.slice(-7).map((d) => ({ value: d.value })) || [];

    // Transform payment methods for donut chart
    const paymentChartData = paymentMethods?.map((p) => ({
        name: p.method,
        value: p.count,
        percentage: p.percentage,
    })) || [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Transaction analytics and merchant insights
                    </p>
                </div>
                <Link to="/upload">
                    <Button className="gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Data
                    </Button>
                </Link>
            </div>

            {/* Demo Notice */}
            {isDemo && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium">Viewing Demo Data</p>
                        <p className="text-sm text-muted-foreground">
                            This is sample data to demonstrate the platform. Upload your own data to see real analytics.
                        </p>
                    </div>
                    <Link to="/upload">
                        <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Data
                        </Button>
                    </Link>
                </div>
            )}

            {/* Smart Cards Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmartCard
                    title="Total Volume"
                    metric={kpis?.total_volume || { value: 0, formatted_value: "—" }}
                    icon={<Activity className="h-4 w-4" />}
                    sparklineData={sparklineData}
                    loading={kpisLoading}
                />
                <SmartCard
                    title="Total Revenue"
                    metric={kpis?.total_revenue || { value: 0, formatted_value: "—" }}
                    icon={<DollarSign className="h-4 w-4" />}
                    sparklineData={sparklineData}
                    loading={kpisLoading}
                />
                <SmartCard
                    title="Active Merchants"
                    metric={kpis?.active_merchants || { value: 0, formatted_value: "—" }}
                    icon={<Users className="h-4 w-4" />}
                    loading={kpisLoading}
                />
                <SmartCard
                    title="Churn Rate"
                    metric={kpis?.churn_rate || { value: 0, formatted_value: "—" }}
                    icon={<TrendingDown className="h-4 w-4" />}
                    loading={kpisLoading}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AreaChart
                        title="Revenue Trend"
                        data={revenueTrend || []}
                        loading={trendLoading}
                        height={350}
                    />
                </div>
                <div>
                    <DonutChart
                        title="Payment Methods"
                        data={paymentChartData}
                        loading={paymentsLoading}
                        height={350}
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Link to="/upload" className="block">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <Upload className="h-5 w-5" />
                                <span>Upload CSV</span>
                            </Button>
                        </Link>
                        <Link to="/churn" className="block">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <TrendingDown className="h-5 w-5" />
                                <span>View Churn Risks</span>
                            </Button>
                        </Link>
                        <Link to="/merchants" className="block">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <Users className="h-5 w-5" />
                                <span>Browse Merchants</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
