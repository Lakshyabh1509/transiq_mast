import { useQuery } from "@tanstack/react-query";
import { api, type MerchantQueryParams } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_MERCHANTS, DEMO_CATEGORIES } from "@/lib/demoData";

/**
 * Hook for fetching merchants with pagination
 * Returns demo data when in demo mode
 */
export function useMerchants(params: MerchantQueryParams = {}) {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["merchants", params, isDemo],
    queryFn: async () => {
      if (isDemo) {
        let data = [...DEMO_MERCHANTS];
        
        // Search filter
        if (params.search) {
          const search = params.search.toLowerCase();
          data = data.filter(
            (m) =>
              m.name.toLowerCase().includes(search) ||
              m.merchant_code.toLowerCase().includes(search)
          );
        }
        
        // Category filter
        if (params.category) {
          data = data.filter((m) => m.category === params.category);
        }
        
        const page = params.page || 1;
        const perPage = params.per_page || 15;
        const start = (page - 1) * perPage;
        const paginatedData = data.slice(start, start + perPage);
        
        return {
          data: paginatedData,
          meta: {
            page,
            per_page: perPage,
            total: data.length,
            total_pages: Math.ceil(data.length / perPage),
          },
        };
      }
      return api.getMerchants(params);
    },
  });
}

/**
 * Hook for fetching merchant categories
 */
export function useMerchantCategories() {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["merchants", "categories", isDemo],
    queryFn: async () => {
      if (isDemo) {
        return DEMO_CATEGORIES;
      }
      const response = await api.getMerchantCategories();
      return response.data;
    },
  });
}

/**
 * Hook for fetching single merchant stats
 */
export function useMerchantStats(merchantId: number | null) {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["merchants", merchantId, "stats", isDemo],
    queryFn: async () => {
      if (!merchantId) return null;
      
      if (isDemo) {
        // Generate mock stats
        return {
          merchant_id: merchantId,
          total_transactions: Math.floor(Math.random() * 10000) + 1000,
          total_revenue: Math.floor(Math.random() * 500000) + 50000,
          avg_transaction: Math.floor(Math.random() * 100) + 20,
        };
      }
      const response = await api.getMerchantStats(merchantId);
      return response.data;
    },
    enabled: !!merchantId,
  });
}
