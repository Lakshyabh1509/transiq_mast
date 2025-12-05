import { useState } from "react";
import { useChurnRisks } from "@/hooks/useChurn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { MerchantDetailModal, type MerchantDetail } from "@/components/MerchantDetailModal";
import { useAuth } from "@/context/AuthContext";
import { getDemoMerchantDetail } from "@/lib/demoData";
import { cn, getRiskColor } from "@/lib/utils";
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
} from "lucide-react";

export function ChurnRisk() {
    const { user } = useAuth();
    const isDemo = user?.id?.startsWith("demo-");

    const [page, setPage] = useState(1);
    const [sortDesc, setSortDesc] = useState(true);
    const [selectedMerchant, setSelectedMerchant] = useState<MerchantDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useChurnRisks({
        page,
        per_page: 15,
        sort_by: "score",
        sort_desc: sortDesc,
    });

    const merchants = data?.data || [];
    const meta = data?.meta;

    const getRiskBadgeVariant = (level: string) => {
        switch (level) {
            case "critical":
                return "destructive";
            case "high":
                return "warning";
            case "medium":
                return "secondary";
            default:
                return "success";
        }
    };

    const handleMerchantClick = (merchantId: number) => {
        if (isDemo) {
            const detail = getDemoMerchantDetail(merchantId);
            if (detail) {
                setSelectedMerchant(detail as MerchantDetail);
                setIsModalOpen(true);
            }
        } else {
            // For real data, create from churn data
            const merchant = merchants.find((m) => m.merchant_id === merchantId);
            if (merchant) {
                setSelectedMerchant({
                    merchant_id: merchant.merchant_id,
                    merchant_code: `MERCH${String(merchant.merchant_id).padStart(3, "0")}`,
                    name: merchant.merchant_name,
                    category: merchant.category,
                    is_active: true,
                    total_transactions: 0,
                    total_revenue: 0,
                    avg_transaction: 0,
                    transaction_trend: merchant.transaction_trend || 0,
                    revenue_trend: merchant.revenue_trend || 0,
                    risk_score: merchant.risk_score,
                    risk_level: merchant.risk_level as "low" | "medium" | "high" | "critical",
                    days_inactive: merchant.days_inactive,
                });
                setIsModalOpen(true);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <AlertTriangle className="h-8 w-8 text-warning" />
                        Churn Risk Analysis
                    </h1>
                    <p className="text-muted-foreground">
                        Merchants at risk of becoming inactive
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setSortDesc(!sortDesc)}
                >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {sortDesc ? "Highest Risk First" : "Lowest Risk First"}
                </Button>
            </div>

            {/* Risk Table */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>At-Risk Merchants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Merchant
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Category
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Risk Score
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Risk Level
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Days Inactive
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Tx Trend
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRowSkeleton key={i} columns={6} />
                                    ))
                                ) : merchants.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                            No churn risk data available
                                        </td>
                                    </tr>
                                ) : (
                                    merchants.map((merchant) => (
                                        <tr
                                            key={merchant.merchant_id}
                                            className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => handleMerchantClick(merchant.merchant_id)}
                                        >
                                            <td className="p-4 font-medium">{merchant.merchant_name}</td>
                                            <td className="p-4 text-muted-foreground">{merchant.category}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all",
                                                                getRiskColor(merchant.risk_level)
                                                            )}
                                                            style={{ width: `${merchant.risk_score * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm">
                                                        {(merchant.risk_score * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={getRiskBadgeVariant(merchant.risk_level)}>
                                                    {merchant.risk_level.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {merchant.days_inactive ?? "—"} days
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={cn(
                                                        "font-medium",
                                                        (merchant.transaction_trend ?? 0) < 0
                                                            ? "text-destructive"
                                                            : "text-success"
                                                    )}
                                                >
                                                    {merchant.transaction_trend
                                                        ? `${merchant.transaction_trend > 0 ? "+" : ""}${merchant.transaction_trend.toFixed(1)}%`
                                                        : "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Showing {merchants.length} of {meta.total} merchants
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                                    Page {page} of {meta.total_pages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                                    disabled={page >= meta.total_pages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Merchant Detail Modal */}
            <MerchantDetailModal
                merchant={selectedMerchant}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
