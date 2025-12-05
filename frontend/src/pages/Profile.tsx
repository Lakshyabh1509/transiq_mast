import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    User,
    Building,
    Mail,
    Calendar,
    Shield,
    Edit,
    CheckCircle,
} from "lucide-react";

export function Profile() {
    const { user } = useAuth();
    const isDemo = user?.id?.startsWith("demo-");

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <User className="h-8 w-8 text-primary" />
                    Profile
                </h1>
                <p className="text-muted-foreground">
                    Your account information and activity
                </p>
            </div>

            {/* Demo Notice */}
            {isDemo && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                        <p className="font-medium">Demo Account</p>
                        <p className="text-sm text-muted-foreground">
                            You're viewing sample data. Connect Supabase for real user accounts.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Profile Card */}
                <div className="lg:col-span-2">
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Account Details</CardTitle>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar & Name */}
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                    {user?.avatar || user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="capitalize">
                                            {user?.role}
                                        </Badge>
                                        <Badge variant="success" className="flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Address
                                    </label>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Organization
                                    </label>
                                    <p className="font-medium">{user?.organization || "—"}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Role
                                    </label>
                                    <p className="font-medium capitalize">{user?.role}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Member Since
                                    </label>
                                    <p className="font-medium">December 2024</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Sidebar */}
                <div className="space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-base">Activity Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Reports Generated</span>
                                <span className="font-bold">23</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Data Uploads</span>
                                <span className="font-bold">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Logins This Month</span>
                                <span className="font-bold">47</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-base">Sessions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                                <div>
                                    <p className="font-medium">Current Session</p>
                                    <p className="text-xs text-muted-foreground">Windows • Chrome</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-muted mt-1.5" />
                                <div>
                                    <p>Yesterday 4:32 PM</p>
                                    <p className="text-xs">MacOS • Safari</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
