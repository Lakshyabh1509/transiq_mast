import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    HelpCircle,
    ArrowLeft,
    Search,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const FAQ_DATA = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "How do I get started with TransactIQ?",
                a: "After logging in, you'll see your Dashboard with key metrics. You can upload transaction data via the 'Upload' page, view merchant analytics, and monitor churn risks. Use the demo mode to explore with sample data.",
            },
            {
                q: "What file formats are supported for data import?",
                a: "Currently, we support CSV files. Your file should include columns for transaction_id, merchant_code, customer_code, amount, and transaction_date. Optional columns include merchant_name, category, and payment_method.",
            },
            {
                q: "How do I access the demo mode?",
                a: "On the login page, click 'Try Demo' to access the platform with sample data. This allows you to explore all features without uploading your own data.",
            },
        ],
    },
    {
        category: "Analytics & Reporting",
        questions: [
            {
                q: "How is the churn risk score calculated?",
                a: "Our ML model analyzes transaction patterns, frequency trends, revenue changes, and days since last activity. Merchants are categorized as Low (<40%), Medium (40-60%), High (60-80%), or Critical (>80%) risk.",
            },
            {
                q: "Can I export my analytics data?",
                a: "Yes! Go to Settings > Data Export to download your data in CSV, Excel, or PDF format. You can export dashboard summaries, merchant lists, and churn risk reports.",
            },
            {
                q: "How often is the dashboard data updated?",
                a: "Dashboard KPIs refresh automatically every 60 seconds. You can also manually refresh by clicking the refresh button or reloading the page.",
            },
        ],
    },
    {
        category: "Account & Security",
        questions: [
            {
                q: "How do I enable two-factor authentication?",
                a: "Go to Settings > Security > Two-factor auth. You'll need an authenticator app (Google Authenticator, Authy, etc.) to scan the QR code and complete the setup.",
            },
            {
                q: "What are the password requirements?",
                a: "Passwords must be at least 8 characters and include: one uppercase letter, one lowercase letter, one number, and one special character.",
            },
            {
                q: "How do I reset my password if I forgot it?",
                a: "On the login page, click 'Forgot password?' and enter your email. You'll receive a password reset link within a few minutes.",
            },
        ],
    },
    {
        category: "Data & Privacy",
        questions: [
            {
                q: "Is my data secure?",
                a: "Yes. We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We're SOC 2 Type II compliant and undergo regular security audits.",
            },
            {
                q: "Can I delete my data?",
                a: "Yes. Contact support to request data deletion. We'll remove all your transaction data, analytics, and account information within 30 days per our data retention policy.",
            },
            {
                q: "Who can access my organization's data?",
                a: "Only users you invite to your organization can access your data. Admins can manage user roles and permissions in Settings > Team Management.",
            },
        ],
    },
    {
        category: "Billing & Plans",
        questions: [
            {
                q: "What plans are available?",
                a: "We offer Starter, Professional, and Enterprise plans. Visit our pricing page or contact sales for detailed feature comparisons and volume-based pricing.",
            },
            {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes. Plan changes can be made in Settings > Billing. Upgrades take effect immediately; downgrades apply at your next billing cycle.",
            },
        ],
    },
];

export function FAQs() {
    const [search, setSearch] = useState("");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleItem = (key: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedItems(newExpanded);
    };

    const filteredData = FAQ_DATA.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
            (q) =>
                q.q.toLowerCase().includes(search.toLowerCase()) ||
                q.a.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((cat) => cat.questions.length > 0);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <HelpCircle className="h-6 w-6 text-primary" />
                        Frequently Asked Questions
                    </h1>
                    <p className="text-muted-foreground">Find answers to common questions</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* FAQ Categories */}
            {filteredData.map((category) => (
                <Card key={category.category} className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                        {category.questions.map((item, i) => {
                            const key = `${category.category}-${i}`;
                            const isExpanded = expandedItems.has(key);
                            return (
                                <div key={i} className="border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleItem(key)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                                    >
                                        <span className="font-medium pr-4">{item.q}</span>
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        )}
                                    </button>
                                    {isExpanded && (
                                        <div className="px-4 pb-4 text-muted-foreground">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}

            {/* Still need help? */}
            <Card className="glass-card border-primary/30">
                <CardContent className="py-6 text-center">
                    <p className="text-lg font-medium mb-2">Still have questions?</p>
                    <p className="text-muted-foreground mb-4">
                        Our support team is here to help
                    </p>
                    <Link to="/contact">
                        <Button>Contact Support</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
