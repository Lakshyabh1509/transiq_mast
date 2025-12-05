import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import {
    Shield,
    Smartphone,
    CheckCircle,
    Copy,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

export function TwoFactorSetup() {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    // Demo secret key
    const secretKey = "JBSWY3DPEHPK3PXP";
    const qrCodeUrl = `otpauth://totp/TransactIQ:${user?.email}?secret=${secretKey}&issuer=TransactIQ`;

    const handleCopySecret = () => {
        navigator.clipboard.writeText(secretKey);
        success("Copied!", "Secret key copied to clipboard");
    };

    const handleVerify = async () => {
        if (code.length !== 6) {
            showError("Invalid Code", "Please enter a 6-digit code");
            return;
        }

        setIsVerifying(true);
        await new Promise((r) => setTimeout(r, 1500));

        // In demo mode, accept any 6-digit code
        success("2FA Enabled!", "Two-factor authentication is now active");
        setStep(3);
        setIsVerifying(false);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/settings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Two-Factor Authentication
                    </h1>
                    <p className="text-muted-foreground">
                        Add an extra layer of security to your account
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                        </div>
                        {s < 3 && (
                            <div
                                className={`w-16 h-1 rounded ${step > s ? "bg-primary" : "bg-muted"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Install App */}
            {step === 1 && (
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5" />
                            Step 1: Install Authenticator App
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Download and install an authenticator app on your mobile device:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="p-4 rounded-lg border bg-muted/30">
                                <p className="font-medium">Google Authenticator</p>
                                <p className="text-sm text-muted-foreground">iOS & Android</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/30">
                                <p className="font-medium">Microsoft Authenticator</p>
                                <p className="text-sm text-muted-foreground">iOS & Android</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/30">
                                <p className="font-medium">Authy</p>
                                <p className="text-sm text-muted-foreground">iOS, Android, Desktop</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/30">
                                <p className="font-medium">1Password</p>
                                <p className="text-sm text-muted-foreground">All platforms</p>
                            </div>
                        </div>
                        <Button onClick={() => setStep(2)} className="w-full">
                            I have an authenticator app
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Scan QR / Enter Code */}
            {step === 2 && (
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Step 2: Scan QR Code or Enter Key</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            {/* QR Code placeholder */}
                            <div className="w-48 h-48 bg-white p-4 rounded-xl">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrCodeUrl)}`}
                                    alt="2FA QR Code"
                                    className="w-full h-full"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Scan this QR code with your authenticator app
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or enter manually
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Secret Key</label>
                            <div className="flex gap-2">
                                <code className="flex-1 px-4 py-2 rounded-lg border bg-muted font-mono text-sm">
                                    {secretKey}
                                </code>
                                <Button variant="outline" size="icon" onClick={handleCopySecret}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Enter the 6-digit code from your app
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Back
                            </Button>
                            <Button onClick={handleVerify} className="flex-1" disabled={isVerifying}>
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify & Enable"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <Card className="glass-card border-success/50">
                    <CardContent className="pt-8 pb-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <h2 className="text-2xl font-bold">2FA Enabled!</h2>
                        <p className="text-muted-foreground">
                            Your account is now protected with two-factor authentication.
                            You'll need to enter a code from your authenticator app when signing in.
                        </p>
                        <Link to="/settings">
                            <Button className="mt-4">Return to Settings</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
