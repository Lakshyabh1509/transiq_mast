import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "analyst" | "viewer";
    avatar?: string;
    organization?: string;
}

// Demo users for showcasing the platform
export const DEMO_USERS: Record<string, User> = {
    admin: {
        id: "demo-admin-001",
        email: "admin@demo.com",
        name: "Sarah Chen",
        role: "admin",
        organization: "Apex Financial Corp",
        avatar: "SC",
    },
    analyst: {
        id: "demo-analyst-001",
        email: "analyst@demo.com",
        name: "Michael Ross",
        role: "analyst",
        organization: "Apex Financial Corp",
        avatar: "MR",
    },
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginAsDemo: (type: "admin" | "analyst") => void;
    logout: () => void;
    // Supabase-ready methods (to be implemented)
    signInWithSupabase?: (email: string, password: string) => Promise<boolean>;
    signUpWithSupabase?: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        // Native Supabase Session Check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata.name || "User",
                    role: session.user.user_metadata.role || "viewer",
                });
            } else {
                // Fallback to local storage (or clear it)
                const storedUser = localStorage.getItem("analytics_user");
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        localStorage.removeItem("analytics_user");
                    }
                }
            }
            setIsLoading(false);
        };
        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        name: session.user.user_metadata.name || "User",
                        role: session.user.user_metadata.role || "viewer",
                    });
                } else if (_event === 'SIGNED_OUT') {
                    setUser(null);
                    localStorage.removeItem("analytics_user");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Persist user to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("analytics_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("analytics_user");
        }
    }, [user]);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Demo login check
        if (email === "admin@demo.com" && password === "demo123") {
            setUser(DEMO_USERS.admin);
            setIsLoading(false);
            return true;
        }
        if (email === "analyst@demo.com" && password === "demo123") {
            setUser(DEMO_USERS.analyst);
            setIsLoading(false);
            return true;
        }

        // TODO: Replace with Supabase authentication
        // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        setIsLoading(false);
        return false;
    };

    const loginAsDemo = (type: "admin" | "analyst") => {
        setUser(DEMO_USERS[type]);
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem("analytics_user");
        await supabase.auth.signOut();
    };

    const signInWithSupabase = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) return false

        if (data.user) {
            setUser({
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata.name || "User",
                role: data.user.user_metadata.role || "viewer",
            })
        }

        return true
    }

    const signUpWithSupabase = async (email: string, password: string, name: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, role: "viewer" }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, error: null };
        } catch (err) {
            return { success: false, error: "An unexpected error occurred during sign up" };
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                loginAsDemo,
                logout,
                signInWithSupabase,
                signUpWithSupabase,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function useRequireAuth() {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            window.location.href = "/login";
        }
    }, [auth.isLoading, auth.isAuthenticated]);

    return auth;
}
