import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
    Mail,
    ArrowLeft,
    Send,
    Loader2,
    CheckCircle,
    MessageCircle,
    Phone,
    Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

export function ContactSupport() {
    const { success } = useToast();
    const [formData, setFormData] = useState({
        subject: "",
        category: "general",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1500));
        success("Message Sent", "We'll get back to you within 24 hours");
        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <div className="space-y-6 max-w-md mx-auto">
                <Card className="glass-card border-success/50">
                    <CardContent className="pt-8 pb-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <h2 className="text-2xl font-bold">Message Received!</h2>
                        <p className="text-muted-foreground">
                            Thank you for contacting us. We'll respond within 24 hours.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Ticket ID: <span className="font-mono">TIQ-{Date.now().toString(36).toUpperCase()}</span>
                        </p>
                        <Link to="/">
                            <Button className="mt-4">Return to Dashboard</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="h-6 w-6 text-primary" />
                        Contact Support
                    </h1>
                    <p className="text-muted-foreground">We're here to help</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="category">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="bug">Bug Report</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="subject">
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Brief description of your issue"
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="message">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Please describe your issue or question in detail..."
                                        rows={6}
                                        className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <Card className="glass-card">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Live Chat</p>
                                        <p className="text-sm text-muted-foreground">
                                            Available 9 AM - 6 PM EST
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">
                                            support@transactiq.io
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-sm text-muted-foreground">
                                            +1 (888) 555-0123
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Response Time</p>
                                    <p className="text-sm text-muted-foreground">
                                        We typically respond within 24 hours for general inquiries
                                        and 4 hours for critical issues.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-primary/30">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Looking for quick answers?
                            </p>
                            <Link to="/faqs">
                                <Button variant="outline" className="w-full">
                                    Browse FAQs
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
