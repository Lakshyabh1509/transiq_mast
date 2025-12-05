import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
    Key,
    ArrowLeft,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export function ChangePassword() {
    const { success, error: showError } = useToast();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShow = (field: "current" | "new" | "confirm") => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const validatePassword = (password: string) => {
        const checks = [
            { test: password.length >= 8, label: "At least 8 characters" },
            { test: /[A-Z]/.test(password), label: "One uppercase letter" },
            { test: /[a-z]/.test(password), label: "One lowercase letter" },
            { test: /[0-9]/.test(password), label: "One number" },
            { test: /[^A-Za-z0-9]/.test(password), label: "One special character" },
        ];
        return checks;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            showError("Error", "New passwords do not match");
            return;
        }

        const checks = validatePassword(formData.newPassword);
        if (!checks.every((c) => c.test)) {
            showError("Weak Password", "Please meet all password requirements");
            return;
        }

        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1500));

        success("Password Changed", "Your password has been updated successfully");
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const passwordChecks = validatePassword(formData.newPassword);

    if (isSuccess) {
        return (
            <div className="space-y-6 max-w-md mx-auto">
                <Card className="glass-card border-success/50">
                    <CardContent className="pt-8 pb-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <h2 className="text-2xl font-bold">Password Changed!</h2>
                        <p className="text-muted-foreground">
                            Your password has been updated successfully.
                        </p>
                        <Link to="/settings">
                            <Button className="mt-4">Return to Settings</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/settings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Key className="h-6 w-6 text-primary" />
                        Change Password
                    </h1>
                    <p className="text-muted-foreground">Update your account password</p>
                </div>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Set New Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="currentPassword">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("current")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="newPassword">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("new")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        {formData.newPassword && (
                            <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                                {passwordChecks.map((check, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        {check.test ? (
                                            <CheckCircle className="h-4 w-4 text-success" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className={check.test ? "text-success" : "text-muted-foreground"}>
                                            {check.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow("confirm")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.confirmPassword !== formData.newPassword && (
                                <p className="text-sm text-destructive">Passwords do not match</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
