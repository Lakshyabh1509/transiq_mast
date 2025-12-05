import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { DEMO_NOTIFICATIONS } from "@/lib/demoData";
import {
    Bell,
    Search,
    ChevronDown,
    LogOut,
    Settings,
    User,
    HelpCircle,
    X,
    AlertTriangle,
    Info,
    CheckCircle,
    Book,
    MessageCircle,
    Mail,
    ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
                setShowHelp(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const unreadCount = DEMO_NOTIFICATIONS.filter((n) => !n.read).length;

    return (
        <header className="sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "relative transition-all duration-200",
                        showSearch ? "w-80" : "w-64"
                    )}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search transactions, merchants..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all text-sm"
                            onFocus={() => setShowSearch(true)}
                            onBlur={() => setShowSearch(false)}
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>

                        {/* Notifications Panel */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-card shadow-lg animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h3 className="font-semibold">Notifications</h3>
                                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                                        Mark all read
                                    </Button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {DEMO_NOTIFICATIONS.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                                                !notif.read && "bg-primary/5"
                                            )}
                                            onClick={() => {
                                                setShowNotifications(false);
                                                if (notif.link) {
                                                    navigate(notif.link);
                                                }
                                            }}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                notif.type === "warning" && "bg-warning/10 text-warning",
                                                notif.type === "info" && "bg-primary/10 text-primary",
                                                notif.type === "success" && "bg-success/10 text-success"
                                            )}>
                                                {notif.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                                                {notif.type === "info" && <Info className="h-4 w-4" />}
                                                {notif.type === "success" && <CheckCircle className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{notif.title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t">
                                    <Link to="/reports" onClick={() => setShowNotifications(false)}>
                                        <Button variant="ghost" className="w-full text-sm" size="sm">
                                            View all notifications
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Help */}
                    <div className="relative" ref={helpRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowHelp(!showHelp)}
                        >
                            <HelpCircle className="h-5 w-5" />
                        </Button>

                        {/* Help Panel */}
                        {showHelp && (
                            <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-card shadow-lg animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h3 className="font-semibold">Help Center</h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => setShowHelp(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="p-2">
                                    <Link
                                        to="/docs"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        onClick={() => setShowHelp(false)}
                                    >
                                        <Book className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">Documentation</p>
                                            <p className="text-xs text-muted-foreground">Learn how to use TransactIQ</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/faqs"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        onClick={() => setShowHelp(false)}
                                    >
                                        <MessageCircle className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">FAQs</p>
                                            <p className="text-xs text-muted-foreground">Common questions answered</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        onClick={() => setShowHelp(false)}
                                    >
                                        <Mail className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">Contact Support</p>
                                            <p className="text-xs text-muted-foreground">Get help from our team</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="p-3 border-t">
                                    <Link
                                        to="/docs"
                                        className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                                        onClick={() => setShowHelp(false)}
                                    >
                                        <span>Visit Help Center</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative ml-2" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-accent transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                {user?.avatar || user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                            </div>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                showDropdown && "rotate-180"
                            )} />
                        </button>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-card shadow-lg py-1 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    {user?.organization && (
                                        <p className="text-xs text-primary mt-1">{user.organization}</p>
                                    )}
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                </div>

                                <div className="border-t py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
