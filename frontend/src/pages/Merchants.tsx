import { useState } from "react";
import { useMerchants, useMerchantCategories } from "@/hooks/useMerchants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { MerchantDetailModal, type MerchantDetail } from "@/components/MerchantDetailModal";
import { useAuth } from "@/context/AuthContext";
import { getDemoMerchantDetail } from "@/lib/demoData";
import {
    Users,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export function Merchants() {
    const { user } = useAuth();
    const isDemo = user?.id?.startsWith("demo-");

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("");
    const [selectedMerchant, setSelectedMerchant] = useState<MerchantDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useMerchants({
        page,
        per_page: 15,
        search: search || undefined,
        category: category || undefined,
    });

    const { data: categories } = useMerchantCategories();

    const merchants = data?.data || [];
    const meta = data?.meta;

    const handleMerchantClick = (merchantId: number) => {
        if (isDemo) {
            const detail = getDemoMerchantDetail(merchantId);
            if (detail) {
                setSelectedMerchant(detail as MerchantDetail);
                setIsModalOpen(true);
            }
        } else {
            // For real data, fetch from API
            // TODO: Implement API call for merchant details
            const merchant = merchants.find((m) => m.merchant_id === merchantId);
            if (merchant) {
                setSelectedMerchant({
                    ...merchant,
                    total_transactions: 0,
                    total_revenue: 0,
                    avg_transaction: 0,
                    transaction_trend: 0,
                    revenue_trend: 0,
                } as MerchantDetail);
                setIsModalOpen(true);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Users className="h-8 w-8 text-primary" />
                    Merchant Performance
                </h1>
                <p className="text-muted-foreground">
                    View and analyze merchant activity
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search merchants..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Merchants Table */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Merchants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Code
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Category
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Location
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="text-left p-4 font-medium text-muted-foreground">
                                        Registered
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
                                            No merchants found
                                        </td>
                                    </tr>
                                ) : (
                                    merchants.map((merchant) => (
                                        <tr
                                            key={merchant.merchant_id}
                                            className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => handleMerchantClick(merchant.merchant_id)}
                                        >
                                            <td className="p-4 font-medium">{merchant.name}</td>
                                            <td className="p-4 text-muted-foreground font-mono text-sm">
                                                {merchant.merchant_code}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="secondary">{merchant.category}</Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {merchant.city ? `${merchant.city}, ` : ""}
                                                {merchant.country}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={merchant.is_active ? "success" : "destructive"}>
                                                    {merchant.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(merchant.registration_date).toLocaleDateString()}
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
