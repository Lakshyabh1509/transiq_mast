import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    BarChart3,
    Shield,
    Zap,
    TrendingUp,
    Eye,
    EyeOff,
    Loader2,
    Play,
} from "lucide-react";

export function Login() {
    const navigate = useNavigate();
    const { login, loginAsDemo, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const success = await login(email, password);

        if (success) {
            navigate("/");
        } else {
            setError("Invalid credentials. Use the demo button to explore.");
        }
        setIsSubmitting(false);
    };

    const handleDemoLogin = () => {
        loginAsDemo("admin");
        navigate("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <BarChart3 className="h-7 w-7" />
                            </div>
                            <span className="text-2xl font-bold">TransactIQ</span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight mb-4">
                            Enterprise Transaction
                            <br />
                            Intelligence Platform
                        </h1>
                        <p className="text-lg text-white/80">
                            Real-time analytics, churn prediction, and actionable insights
                            for financial institutions worldwide.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Feature
                            icon={<TrendingUp className="h-5 w-5" />}
                            title="Predictive Analytics"
                            description="ML-powered churn prediction with 94% accuracy"
                        />
                        <Feature
                            icon={<Shield className="h-5 w-5" />}
                            title="Bank-Grade Security"
                            description="SOC 2 Type II compliant with RLS policies"
                        />
                        <Feature
                            icon={<Zap className="h-5 w-5" />}
                            title="Real-Time Processing"
                            description="Process millions of transactions per second"
                        />
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-sm text-white/60">Trusted by leading institutions</p>
                        <div className="flex items-center gap-6 mt-4 text-white/40 font-semibold">
                            <span>APEX BANK</span>
                            <span>MERIDIAN</span>
                            <span>NOVA FIN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">TransactIQ</span>
                    </div>

                    <Card className="glass-card border-2">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-bold text-center">
                                Welcome back
                            </CardTitle>
                            <p className="text-center text-muted-foreground">
                                Sign in to your enterprise dashboard
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Demo Login Button - Prominent */}
                            <Button
                                onClick={handleDemoLogin}
                                className="w-full h-12 text-base gradient-primary"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                Try Demo (Sample Data Included)
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or sign in with credentials
                                    </span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            className="rounded border-input"
                                        />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="w-full h-11"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground">
                                Need an account?{" "}
                                <Link to="/signup" className="text-primary hover:underline font-medium">
                                    Sign up free
                                </Link>
                            </p>
                        </CardContent>
                    </Card>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        By signing in, you agree to our{" "}
                        <a href="#" className="underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

function Feature({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-white/70">{description}</p>
            </div>
        </div>
    );
}
