const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

/**
 * API client for making requests to the backend
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard endpoints
  async getDashboardKPIs() {
    return this.request<{ data: DashboardKPIs }>("/dashboard/kpis");
  }

  async getRevenueTrend(days = 30) {
    return this.request<{ data: TimeSeriesPoint[] }>(
      `/dashboard/revenue-trend?days=${days}`
    );
  }

  async getRevenueByCategory(limit = 6) {
    return this.request<{ data: RevenueByCategory[] }>(
      `/dashboard/revenue-by-category?limit=${limit}`
    );
  }

  async getPaymentMethods() {
    return this.request<{ data: PaymentMethodSplit[] }>(
      "/dashboard/payment-methods"
    );
  }

  // Churn endpoints
  async getChurnRisks(params: ChurnQueryParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.per_page) searchParams.set("per_page", String(params.per_page));
    if (params.risk_level) searchParams.set("risk_level", params.risk_level);
    if (params.sort_by) searchParams.set("sort_by", params.sort_by);
    if (params.sort_desc !== undefined)
      searchParams.set("sort_desc", String(params.sort_desc));

    return this.request<PaginatedResponse<ChurnRiskMerchant>>(
      `/churn/risks?${searchParams}`
    );
  }

  async recalculateChurn() {
    return this.request<{ data: { message: string } }>("/churn/recalculate", {
      method: "POST",
    });
  }

  // Merchant endpoints
  async getMerchants(params: MerchantQueryParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.per_page) searchParams.set("per_page", String(params.per_page));
    if (params.search) searchParams.set("search", params.search);
    if (params.category) searchParams.set("category", params.category);

    return this.request<PaginatedResponse<Merchant>>(
      `/merchants?${searchParams}`
    );
  }

  async getMerchantCategories() {
    return this.request<{ data: string[] }>("/merchants/categories");
  }

  async getMerchantStats(merchantId: number) {
    return this.request<{ data: MerchantStats }>(
      `/merchants/${merchantId}/stats`
    );
  }

  // Upload
  async uploadCSV(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/upload/csv`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Types
export interface KPIMetric {
  value: number;
  formatted_value: string;
  previous_value?: number;
  change_percent?: number;
  trend?: "up" | "down" | "stable";
}

export interface DashboardKPIs {
  total_volume: KPIMetric;
  total_revenue: KPIMetric;
  active_merchants: KPIMetric;
  churn_rate: KPIMetric;
  avg_transaction: KPIMetric;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
}

export interface PaymentMethodSplit {
  method: string;
  count: number;
  percentage: number;
}

export interface ChurnRiskMerchant {
  merchant_id: number;
  merchant_name: string;
  category: string;
  risk_score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  days_inactive?: number;
  transaction_trend?: number;
  revenue_trend?: number;
  last_transaction_date?: string;
}

export interface Merchant {
  merchant_id: number;
  merchant_code: string;
  name: string;
  category: string;
  subcategory?: string;
  registration_date: string;
  city?: string;
  country: string;
  is_active: boolean;
}

export interface MerchantStats {
  merchant_id: number;
  total_transactions: number;
  total_revenue: number;
  avg_transaction: number;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ChurnQueryParams {
  page?: number;
  per_page?: number;
  risk_level?: string;
  sort_by?: string;
  sort_desc?: boolean;
}

export interface MerchantQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
}

export const api = new ApiClient(API_BASE_URL);
