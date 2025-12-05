import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  DEMO_KPIS,
  DEMO_REVENUE_TREND,
  DEMO_PAYMENT_METHODS,
} from "@/lib/demoData";

/**
 * Hook for fetching dashboard KPIs
 * Returns demo data when in demo mode
 */
export function useKPIs() {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["dashboard", "kpis", isDemo],
    queryFn: async () => {
      if (isDemo) {
        // Return demo data
        return DEMO_KPIS;
      }
      const response = await api.getDashboardKPIs();
      return response.data;
    },
    refetchInterval: isDemo ? false : 60000, // Auto-refresh only for real data
  });
}

/**
 * Hook for fetching revenue trend data
 */
export function useRevenueTrend(days = 30) {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["dashboard", "revenue-trend", days, isDemo],
    queryFn: async () => {
      if (isDemo) {
        return DEMO_REVENUE_TREND;
      }
      const response = await api.getRevenueTrend(days);
      return response.data;
    },
  });
}

/**
 * Hook for fetching revenue by category
 */
export function useRevenueByCategory(limit = 6) {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["dashboard", "revenue-category", limit, isDemo],
    queryFn: async () => {
      if (isDemo) {
        // Demo data is already available via DEMO_REVENUE_BY_CATEGORY
        const { DEMO_REVENUE_BY_CATEGORY } = await import("@/lib/demoData");
        return DEMO_REVENUE_BY_CATEGORY;
      }
      const response = await api.getRevenueByCategory(limit);
      return response.data;
    },
  });
}

/**
 * Hook for fetching payment method split
 */
export function usePaymentMethods() {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["dashboard", "payment-methods", isDemo],
    queryFn: async () => {
      if (isDemo) {
        return DEMO_PAYMENT_METHODS;
      }
      const response = await api.getPaymentMethods();
      return response.data;
    },
  });
}
