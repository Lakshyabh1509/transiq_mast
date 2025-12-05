import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
    X,
    MapPin,
    Calendar,
    TrendingUp,
    TrendingDown,
    Activity,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Loader2,
    Phone,
    Mail,
} from "lucide-react";

// Extended merchant detail data for demo
export interface MerchantDetail {
    merchant_id: number;
    merchant_code: string;
    name: string;
    category: string;
    subcategory?: string;
    city?: string;
    country?: string;
    registration_date?: string;
    is_active: boolean;
    // Stats
    total_transactions: number;
    total_revenue: number;
    avg_transaction: number;
    transaction_trend: number;
    revenue_trend: number;
    // Churn info (optional)
    risk_score?: number;
    risk_level?: "low" | "medium" | "high" | "critical";
    days_inactive?: number;
    // Contact info
    phone?: string;
    email?: string;
}

interface MerchantDetailModalProps {
    merchant: MerchantDetail | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
}

// Generate demo phone and email for a merchant
function getMerchantContact(merchantId: number, merchantName: string) {
    // Generate consistent demo phone/email based on merchant ID
    const areaCode = 555;
    const phoneNum = String(1000 + merchantId).padStart(4, '0');
    const phone = `+1 (${areaCode}) ${phoneNum.slice(0, 3)}-${phoneNum.slice(3)}`;

    // Generate email from merchant name
    const emailName = merchantName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
    const email = `contact@${emailName}.com`;

    return { phone, email };
}

// Generate mailto link with pre-filled subject and body
function getMailtoLink(merchant: MerchantDetail) {
    const subject = encodeURIComponent(`TransactIQ - Account Follow-up: ${merchant.name}`);
    const body = encodeURIComponent(
        `Dear ${merchant.name} Team,

I hope this email finds you well. We noticed some changes in your transaction activity and wanted to reach out to ensure everything is going smoothly.

As your payment analytics partner, we're here to support your business success. If you have any questions about your account or need assistance, please don't hesitate to let us know.

Key Account Details:
- Merchant ID: ${merchant.merchant_code}
- Category: ${merchant.category}
${merchant.risk_score !== undefined ? `- Current Status: Requires attention\n` : ''}
We value your partnership and look forward to continuing to serve your business.

Best regards,
TransactIQ Support Team`
    );

    const { email } = getMerchantContact(merchant.merchant_id, merchant.name);
    return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function MerchantDetailModal({
    merchant,
    isOpen,
    onClose,
    isLoading,
}: MerchantDetailModalProps) {
    if (!isOpen) return null;

    const contact = merchant ? getMerchantContact(merchant.merchant_id, merchant.name) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 bg-card rounded-2xl shadow-2xl border animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-card/95 backdrop-blur">
                    <div>
                        <h2 className="text-xl font-bold">Merchant Details</h2>
                        <p className="text-sm text-muted-foreground">
                            Performance overview and analytics
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : merchant ? (
                    <div className="p-6 space-y-6">
                        {/* Merchant Info */}
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                {merchant.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold">{merchant.name}</h3>
                                    {merchant.is_active ? (
                                        <Badge variant="success" className="flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">Inactive</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {merchant.merchant_code}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary">{merchant.category}</Badge>
                                    {merchant.subcategory && (
                                        <Badge variant="outline">{merchant.subcategory}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Location & Date */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {merchant.city && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {merchant.city}, {merchant.country}
                                    </span>
                                </div>
                            )}
                            {merchant.registration_date && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Joined {new Date(merchant.registration_date).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Churn Risk (if available) */}
                        {merchant.risk_score !== undefined && (
                            <div
                                className={cn(
                                    "p-4 rounded-xl border",
                                    merchant.risk_level === "critical"
                                        ? "bg-destructive/10 border-destructive/30"
                                        : merchant.risk_level === "high"
                                            ? "bg-warning/10 border-warning/30"
                                            : merchant.risk_level === "medium"
                                                ? "bg-yellow-500/10 border-yellow-500/30"
                                                : "bg-success/10 border-success/30"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle
                                            className={cn(
                                                "h-5 w-5",
                                                merchant.risk_level === "critical"
                                                    ? "text-destructive"
                                                    : merchant.risk_level === "high"
                                                        ? "text-warning"
                                                        : "text-muted-foreground"
                                            )}
                                        />
                                        <span className="font-medium">Churn Risk</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {(merchant.risk_score * 100).toFixed(0)}%
                                        </p>
                                        <Badge
                                            variant={
                                                merchant.risk_level === "critical"
                                                    ? "destructive"
                                                    : merchant.risk_level === "high"
                                                        ? "warning"
                                                        : "secondary"
                                            }
                                            className="capitalize"
                                        >
                                            {merchant.risk_level} risk
                                        </Badge>
                                    </div>
                                </div>
                                {merchant.days_inactive !== undefined && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Last activity: {merchant.days_inactive} days ago
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Activity className="h-4 w-4" />
                                    <span className="text-sm">Total Transactions</span>
                                </div>
                                <p className="text-2xl font-bold">
                                    {merchant.total_transactions.toLocaleString()}
                                </p>
                                <TrendIndicator value={merchant.transaction_trend} />
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="text-sm">Total Revenue</span>
                                </div>
                                <p className="text-2xl font-bold">
                                    ${merchant.total_revenue.toLocaleString()}
                                </p>
                                <TrendIndicator value={merchant.revenue_trend} />
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50 sm:col-span-2">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="text-sm">Average Transaction</span>
                                </div>
                                <p className="text-2xl font-bold">
                                    ${merchant.avg_transaction.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-3 pt-2">
                            <a
                                href={`tel:${contact?.phone?.replace(/\D/g, '')}`}
                                className="flex-1"
                            >
                                <Button variant="outline" className="w-full">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Merchant
                                </Button>
                            </a>
                            <a
                                href={getMailtoLink(merchant)}
                                className="flex-1"
                            >
                                <Button className="w-full">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                </Button>
                            </a>
                        </div>

                        {/* Contact Info */}
                        {contact && (
                            <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="hover:underline">
                                        {contact.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <a href={`mailto:${contact.email}`} className="hover:underline">
                                        {contact.email}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 text-center text-muted-foreground">
                        No merchant data available
                    </div>
                )}
            </div>
        </div>
    );
}

function TrendIndicator({ value }: { value: number }) {
    if (value === 0) return null;

    const isPositive = value > 0;
    return (
        <div
            className={cn(
                "flex items-center gap-1 text-sm mt-1",
                isPositive ? "text-success" : "text-destructive"
            )}
        >
            {isPositive ? (
                <TrendingUp className="h-4 w-4" />
            ) : (
                <TrendingDown className="h-4 w-4" />
            )}
            <span>
                {isPositive ? "+" : ""}
                {value.toFixed(1)}% vs last period
            </span>
        </div>
    );
}
