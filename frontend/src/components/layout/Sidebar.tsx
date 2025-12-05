import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    Upload,
    Settings,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
} from "lucide-react";

const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/merchants", icon: Users, label: "Merchants" },
    { to: "/churn", icon: AlertTriangle, label: "Churn Risk" },
    { to: "/upload", icon: Upload, label: "Upload Data" },
];

interface SidebarProps {
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const dark = localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newDark);
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
                {!collapsed && (
                    <h1 className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                        Analytics
                    </h1>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCollapse?.(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-2 border-t">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="flex-shrink-0"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    {!collapsed && (
                        <NavLink
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </aside>
    );
}
