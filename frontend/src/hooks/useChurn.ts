import { useQuery } from "@tanstack/react-query";
import { api, type ChurnQueryParams } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DEMO_CHURN_RISKS } from "@/lib/demoData";

/**
 * Hook for fetching churn risk data
 * Returns demo data when in demo mode
 */
export function useChurnRisks(params: ChurnQueryParams = {}) {
  const { user } = useAuth();
  const isDemo = user?.id?.startsWith("demo-");

  return useQuery({
    queryKey: ["churn", "risks", params, isDemo],
    queryFn: async () => {
      if (isDemo) {
        // Filter and sort demo data
        let data = [...DEMO_CHURN_RISKS];
        
        if (params.risk_level) {
          data = data.filter((m) => m.risk_level === params.risk_level);
        }
        
        if (params.sort_by === "score") {
          data.sort((a, b) => 
            params.sort_desc ? b.risk_score - a.risk_score : a.risk_score - b.risk_score
          );
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
      return api.getChurnRisks(params);
    },
  });
}
