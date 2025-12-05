import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Download,
    Key,
    Building,
    Mail,
    Palette,
    ChevronRight,
} from "lucide-react";

export function Settings() {
    const { user } = useAuth();
    const { success } = useToast();

    const handleExport = (format: string) => {
        success(`Export Started`, `Your ${format.toUpperCase()} export is being prepared.`);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <SettingsIcon className="h-8 w-8 text-primary" />
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account and preferences
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                                    {user?.avatar || user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                                    <p className="text-muted-foreground">{user?.email}</p>
                                    <Badge variant="secondary" className="mt-1 capitalize">
                                        {user?.role}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Organization
                                    </label>
                                    <p className="mt-1 font-medium">{user?.organization || "—"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </label>
                                    <p className="mt-1 font-medium">{user?.email}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Link to="/profile">
                                    <Button variant="outline" className="w-full justify-between">
                                        View Full Profile
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Export */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Data Export
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Export your analytics data in various formats for reporting and compliance.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <Button
                                    variant="outline"
                                    className="h-auto py-4 flex flex-col gap-2"
                                    onClick={() => handleExport("csv")}
                                >
                                    <span className="text-lg font-bold">CSV</span>
                                    <span className="text-xs text-muted-foreground">Spreadsheet format</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-auto py-4 flex flex-col gap-2"
                                    onClick={() => handleExport("excel")}
                                >
                                    <span className="text-lg font-bold">Excel</span>
                                    <span className="text-xs text-muted-foreground">Microsoft Excel</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-auto py-4 flex flex-col gap-2"
                                    onClick={() => handleExport("pdf")}
                                >
                                    <span className="text-lg font-bold">PDF</span>
                                    <span className="text-xs text-muted-foreground">Print-ready report</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Bell className="h-4 w-4" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <label className="flex items-center justify-between">
                                <span className="text-sm">Email alerts</span>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm">Churn warnings</span>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm">Weekly digest</span>
                                <input type="checkbox" className="rounded" />
                            </label>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Shield className="h-4 w-4" />
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link to="/settings/password">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Key className="h-4 w-4 mr-2" />
                                    Change password
                                </Button>
                            </Link>
                            <Link to="/settings/2fa">
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Two-factor auth
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Theme */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Palette className="h-4 w-4" />
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Toggle dark mode using the sun/moon icon in the sidebar.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
