import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ChurnRisk } from "./pages/ChurnRisk";
import { Merchants } from "./pages/Merchants";
import { Upload } from "./pages/Upload";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { SignUp } from "./pages/SignUp";
import { TwoFactorSetup } from "./pages/TwoFactorSetup";
import { ChangePassword } from "./pages/ChangePassword";
import { Documentation } from "./pages/Documentation";
import { FAQs } from "./pages/FAQs";
import { ContactSupport } from "./pages/ContactSupport";
import { Reports } from "./pages/Reports";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't render routes until auth is checked
  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <SignUp />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/merchants"
        element={
          <Layout>
            <Merchants />
          </Layout>
        }
      />
      <Route
        path="/churn"
        element={
          <Layout>
            <ChurnRisk />
          </Layout>
        }
      />
      <Route
        path="/upload"
        element={
          <Layout>
            <Upload />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/settings/2fa"
        element={
          <Layout>
            <TwoFactorSetup />
          </Layout>
        }
      />
      <Route
        path="/settings/password"
        element={
          <Layout>
            <ChangePassword />
          </Layout>
        }
      />
      <Route
        path="/docs"
        element={
          <Layout>
            <Documentation />
          </Layout>
        }
      />
      <Route
        path="/faqs"
        element={
          <Layout>
            <FAQs />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactSupport />
          </Layout>
        }
      />
      <Route
        path="/reports"
        element={
          <Layout>
            <Reports />
          </Layout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
