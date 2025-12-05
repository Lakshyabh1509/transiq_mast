import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    BarChart3,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle,
    Building,
    Mail,
    User,
    Lock,
} from "lucide-react";

export function SignUp() {
    const navigate = useNavigate();
    const { loginAsDemo } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsSubmitting(true);

        // Simulate signup delay (replace with Supabase)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // For demo, just redirect to login
        setStep(2);
        setIsSubmitting(false);
    };

    const handleTryDemo = () => {
        loginAsDemo("admin");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                        <BarChart3 className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold">TransactIQ</span>
                </div>

                {step === 1 ? (
                    <Card className="glass-card border-2">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-bold text-center">
                                Create an Account
                            </CardTitle>
                            <p className="text-center text-muted-foreground">
                                Start your 14-day free trial
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2" htmlFor="name">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2" htmlFor="email">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Work Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2" htmlFor="organization">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        Organization
                                    </label>
                                    <input
                                        id="organization"
                                        name="organization"
                                        type="text"
                                        placeholder="Acme Corp"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2" htmlFor="password">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 gradient-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleTryDemo}
                            >
                                Try Demo Instead
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="glass-card border-2 border-success/50">
                        <CardContent className="pt-8 pb-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-success" />
                            </div>
                            <h2 className="text-2xl font-bold">Account Created!</h2>
                            <p className="text-muted-foreground">
                                We've sent a confirmation email to<br />
                                <strong>{formData.email}</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Check your inbox and click the link to activate your account.
                            </p>
                            <div className="pt-4 space-y-3">
                                <Link to="/login">
                                    <Button className="w-full">Go to Login</Button>
                                </Link>
                                <Button variant="outline" className="w-full" onClick={handleTryDemo}>
                                    Try Demo While Waiting
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a href="#" className="underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
