import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Book,
    ArrowLeft,
    Search,
    ChevronRight,
    BarChart3,
    Upload,
    Users,
    TrendingDown,
    Settings,
    Shield,
    FileSpreadsheet,
} from "lucide-react";
import { Link } from "react-router-dom";

const DOCS_SECTIONS = [
    {
        title: "Getting Started",
        icon: <BarChart3 className="h-5 w-5" />,
        articles: [
            { title: "Platform Overview", time: "5 min read" },
            { title: "Dashboard Navigation", time: "3 min read" },
            { title: "Understanding KPIs", time: "7 min read" },
        ],
    },
    {
        title: "Data Import",
        icon: <Upload className="h-5 w-5" />,
        articles: [
            { title: "CSV File Format", time: "4 min read" },
            { title: "Uploading Transactions", time: "3 min read" },
            { title: "Data Validation Rules", time: "6 min read" },
            { title: "Bulk Import Best Practices", time: "5 min read" },
        ],
    },
    {
        title: "Merchant Analytics",
        icon: <Users className="h-5 w-5" />,
        articles: [
            { title: "Merchant Performance Metrics", time: "8 min read" },
            { title: "Filtering and Searching", time: "4 min read" },
            { title: "Exporting Merchant Data", time: "3 min read" },
        ],
    },
    {
        title: "Churn Prediction",
        icon: <TrendingDown className="h-5 w-5" />,
        articles: [
            { title: "How Churn Scoring Works", time: "10 min read" },
            { title: "Risk Level Categories", time: "5 min read" },
            { title: "Retention Strategies", time: "12 min read" },
        ],
    },
    {
        title: "Account & Security",
        icon: <Shield className="h-5 w-5" />,
        articles: [
            { title: "Setting Up 2FA", time: "4 min read" },
            { title: "Password Requirements", time: "2 min read" },
            { title: "Managing Team Access", time: "6 min read" },
        ],
    },
    {
        title: "API Reference",
        icon: <FileSpreadsheet className="h-5 w-5" />,
        articles: [
            { title: "Authentication", time: "5 min read" },
            { title: "Dashboard Endpoints", time: "8 min read" },
            { title: "Merchant Endpoints", time: "7 min read" },
            { title: "Upload Endpoints", time: "6 min read" },
        ],
    },
];

export function Documentation() {
    const [search, setSearch] = useState("");
    const [expandedSection, setExpandedSection] = useState<string | null>("Getting Started");

    const filteredSections = DOCS_SECTIONS.map((section) => ({
        ...section,
        articles: section.articles.filter((a) =>
            a.title.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((s) => s.articles.length > 0 || s.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Book className="h-6 w-6 text-primary" />
                        Documentation
                    </h1>
                    <p className="text-muted-foreground">
                        Learn how to use TransactIQ effectively
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search documentation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Documentation Sections */}
            <div className="grid gap-4 lg:grid-cols-2">
                {filteredSections.map((section) => (
                    <Card key={section.title} className="glass-card">
                        <CardHeader
                            className="cursor-pointer"
                            onClick={() =>
                                setExpandedSection(
                                    expandedSection === section.title ? null : section.title
                                )
                            }
                        >
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span className="flex items-center gap-2">
                                    <span className="text-primary">{section.icon}</span>
                                    {section.title}
                                </span>
                                <ChevronRight
                                    className={`h-5 w-5 transition-transform ${expandedSection === section.title ? "rotate-90" : ""
                                        }`}
                                />
                            </CardTitle>
                        </CardHeader>
                        {expandedSection === section.title && (
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    {section.articles.map((article, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                                        >
                                            <span className="text-sm group-hover:text-primary transition-colors">
                                                {article.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {article.time}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
