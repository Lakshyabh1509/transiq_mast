// Demo/Mock data for the application
// This data is used when running in demo mode to showcase the platform

import type { DashboardKPIs, TimeSeriesPoint, RevenueByCategory, PaymentMethodSplit, ChurnRiskMerchant, Merchant } from "./api";

export const DEMO_KPIS: DashboardKPIs = {
  total_volume: {
    value: 1247853,
    formatted_value: "1.2M",
    previous_value: 1156234,
    change_percent: 7.9,
    trend: "up",
  },
  total_revenue: {
    value: 45672340,
    formatted_value: "$45.7M",
    previous_value: 42156890,
    change_percent: 8.3,
    trend: "up",
  },
  active_merchants: {
    value: 3847,
    formatted_value: "3,847",
    previous_value: 3654,
    change_percent: 5.3,
    trend: "up",
  },
  churn_rate: {
    value: 2.4,
    formatted_value: "2.4%",
    previous_value: 3.1,
    change_percent: -22.6,
    trend: "down",
  },
  avg_transaction: {
    value: 36.6,
    formatted_value: "$36.60",
    previous_value: 36.46,
    change_percent: 0.4,
    trend: "stable",
  },
};

export const DEMO_REVENUE_TREND: TimeSeriesPoint[] = [
  { date: "2024-11-01", value: 1456000 },
  { date: "2024-11-05", value: 1523000 },
  { date: "2024-11-10", value: 1489000 },
  { date: "2024-11-15", value: 1678000 },
  { date: "2024-11-20", value: 1534000 },
  { date: "2024-11-25", value: 1621000 },
  { date: "2024-12-01", value: 1745000 },
  { date: "2024-12-05", value: 1823000 },
  { date: "2024-12-10", value: 1567000 },
  { date: "2024-12-15", value: 1892000 },
  { date: "2024-12-20", value: 1678000 },
  { date: "2024-12-25", value: 1934000 },
  { date: "2024-12-30", value: 2012000 },
];

export const DEMO_REVENUE_BY_CATEGORY: RevenueByCategory[] = [
  { category: "Retail", revenue: 12450000, percentage: 27.3 },
  { category: "Food & Beverage", revenue: 9870000, percentage: 21.6 },
  { category: "Electronics", revenue: 8340000, percentage: 18.3 },
  { category: "Healthcare", revenue: 6120000, percentage: 13.4 },
  { category: "Travel", revenue: 5230000, percentage: 11.5 },
  { category: "Other", revenue: 3662340, percentage: 8.0 },
];

export const DEMO_PAYMENT_METHODS: PaymentMethodSplit[] = [
  { method: "Credit Card", count: 523456, percentage: 41.9 },
  { method: "Debit Card", count: 387234, percentage: 31.0 },
  { method: "Digital Wallet", count: 224567, percentage: 18.0 },
  { method: "Bank Transfer", count: 112596, percentage: 9.0 },
];

export const DEMO_CHURN_RISKS: ChurnRiskMerchant[] = [
  {
    merchant_id: 1,
    merchant_name: "TechStyle Electronics",
    category: "Electronics",
    risk_score: 0.87,
    risk_level: "critical",
    days_inactive: 45,
    transaction_trend: -42.3,
    revenue_trend: -38.7,
  },
  {
    merchant_id: 2,
    merchant_name: "Gourmet Delights",
    category: "Food & Beverage",
    risk_score: 0.73,
    risk_level: "high",
    days_inactive: 28,
    transaction_trend: -31.2,
    revenue_trend: -25.8,
  },
  {
    merchant_id: 3,
    merchant_name: "Urban Threads",
    category: "Retail",
    risk_score: 0.65,
    risk_level: "high",
    days_inactive: 21,
    transaction_trend: -18.5,
    revenue_trend: -22.1,
  },
  {
    merchant_id: 4,
    merchant_name: "Wellness Hub",
    category: "Healthcare",
    risk_score: 0.52,
    risk_level: "medium",
    days_inactive: 14,
    transaction_trend: -12.3,
    revenue_trend: -8.9,
  },
  {
    merchant_id: 5,
    merchant_name: "Quick Mart Express",
    category: "Retail",
    risk_score: 0.48,
    risk_level: "medium",
    days_inactive: 12,
    transaction_trend: -8.7,
    revenue_trend: -5.2,
  },
  {
    merchant_id: 6,
    merchant_name: "Coffee Central",
    category: "Food & Beverage",
    risk_score: 0.34,
    risk_level: "low",
    days_inactive: 7,
    transaction_trend: -3.2,
    revenue_trend: 2.1,
  },
  {
    merchant_id: 7,
    merchant_name: "Digital Dreams",
    category: "Electronics",
    risk_score: 0.28,
    risk_level: "low",
    days_inactive: 5,
    transaction_trend: 2.4,
    revenue_trend: 5.8,
  },
  {
    merchant_id: 8,
    merchant_name: "Fresh Foods Market",
    category: "Grocery",
    risk_score: 0.22,
    risk_level: "low",
    days_inactive: 3,
    transaction_trend: 8.6,
    revenue_trend: 12.3,
  },
];

export const DEMO_MERCHANTS: Merchant[] = [
  {
    merchant_id: 1,
    merchant_code: "MERCH001",
    name: "TechStyle Electronics",
    category: "Electronics",
    subcategory: "Consumer Electronics",
    registration_date: "2023-03-15",
    city: "New York",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 2,
    merchant_code: "MERCH002",
    name: "Gourmet Delights",
    category: "Food & Beverage",
    subcategory: "Fine Dining",
    registration_date: "2022-11-08",
    city: "Los Angeles",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 3,
    merchant_code: "MERCH003",
    name: "Urban Threads",
    category: "Retail",
    subcategory: "Fashion",
    registration_date: "2023-01-22",
    city: "Chicago",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 4,
    merchant_code: "MERCH004",
    name: "Wellness Hub",
    category: "Healthcare",
    subcategory: "Wellness Centers",
    registration_date: "2022-08-30",
    city: "Miami",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 5,
    merchant_code: "MERCH005",
    name: "Quick Mart Express",
    category: "Retail",
    subcategory: "Convenience Stores",
    registration_date: "2023-05-12",
    city: "Houston",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 6,
    merchant_code: "MERCH006",
    name: "Coffee Central",
    category: "Food & Beverage",
    subcategory: "Cafes",
    registration_date: "2022-06-18",
    city: "Seattle",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 7,
    merchant_code: "MERCH007",
    name: "Digital Dreams",
    category: "Electronics",
    subcategory: "Gaming",
    registration_date: "2023-09-05",
    city: "San Francisco",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 8,
    merchant_code: "MERCH008",
    name: "Fresh Foods Market",
    category: "Grocery",
    subcategory: "Supermarkets",
    registration_date: "2022-04-25",
    city: "Boston",
    country: "USA",
    is_active: true,
  },
  {
    merchant_id: 9,
    merchant_code: "MERCH009",
    name: "Fitness First",
    category: "Healthcare",
    subcategory: "Gyms",
    registration_date: "2023-02-14",
    city: "Denver",
    country: "USA",
    is_active: false,
  },
  {
    merchant_id: 10,
    merchant_code: "MERCH010",
    name: "Book Nook",
    category: "Retail",
    subcategory: "Bookstores",
    registration_date: "2022-12-01",
    city: "Portland",
    country: "USA",
    is_active: true,
  },
];

export const DEMO_CATEGORIES = ["Electronics", "Food & Beverage", "Retail", "Healthcare", "Grocery", "Travel"];

// Sample notifications for demo - each has an action type and optional link
export const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    title: "High Churn Risk Alert",
    message: "TechStyle Electronics has been flagged as critical risk",
    time: "5 min ago",
    type: "warning" as const,
    read: false,
    action: "navigate" as const,
    link: "/churn",
  },
  {
    id: 2,
    title: "Weekly Report Ready",
    message: "Your transaction analytics report is ready to download",
    time: "1 hour ago",
    type: "info" as const,
    read: false,
    action: "download" as const,
    link: "/reports",
  },
  {
    id: 3,
    title: "New Merchant Onboarded",
    message: "Fresh Foods Market has been added to your network",
    time: "3 hours ago",
    type: "success" as const,
    read: true,
    action: "navigate" as const,
    link: "/merchants",
  },
];

// Sample CSV content for download
export const SAMPLE_CSV_CONTENT = `transaction_id,merchant_code,merchant_name,customer_code,amount,transaction_date,category,segment,payment_method
TXN001,MERCH001,Coffee Central,CUST001,4.50,2024-12-01 08:30:00,Food & Beverage,premium,credit
TXN002,MERCH002,Tech Store Pro,CUST002,299.99,2024-12-01 10:15:00,Electronics,standard,debit
TXN003,MERCH003,Fashion Hub,CUST003,89.50,2024-12-01 12:00:00,Retail,premium,credit
TXN004,MERCH001,Coffee Central,CUST004,6.75,2024-12-01 14:20:00,Food & Beverage,basic,digital_wallet
TXN005,MERCH004,Grocery Mart,CUST005,156.32,2024-12-01 16:45:00,Grocery,standard,bank_transfer
TXN006,MERCH002,Tech Store Pro,CUST001,49.99,2024-12-02 09:00:00,Electronics,premium,credit
TXN007,MERCH005,Fitness First,CUST006,45.00,2024-12-02 11:30:00,Healthcare,premium,credit
TXN008,MERCH003,Fashion Hub,CUST007,234.00,2024-12-02 13:15:00,Retail,standard,debit
TXN009,MERCH006,Book Nook,CUST008,28.50,2024-12-02 15:00:00,Entertainment,basic,credit
TXN010,MERCH001,Coffee Central,CUST002,5.25,2024-12-02 17:30:00,Food & Beverage,standard,digital_wallet`;

export function downloadSampleCSV() {
  const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample_transactions.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Demo merchant detail data with stats
export interface DemoMerchantDetail {
  merchant_id: number;
  merchant_code: string;
  name: string;
  category: string;
  subcategory?: string;
  city?: string;
  country?: string;
  registration_date?: string;
  is_active: boolean;
  total_transactions: number;
  total_revenue: number;
  avg_transaction: number;
  transaction_trend: number;
  revenue_trend: number;
  risk_score?: number;
  risk_level?: "low" | "medium" | "high" | "critical";
  days_inactive?: number;
}

export const DEMO_MERCHANT_DETAILS: Record<number, DemoMerchantDetail> = {
  1: {
    merchant_id: 1,
    merchant_code: "MERCH001",
    name: "TechStyle Electronics",
    category: "Electronics",
    subcategory: "Consumer Electronics",
    city: "New York",
    country: "USA",
    registration_date: "2023-03-15",
    is_active: true,
    total_transactions: 8456,
    total_revenue: 423500,
    avg_transaction: 50.08,
    transaction_trend: -42.3,
    revenue_trend: -38.7,
    risk_score: 0.87,
    risk_level: "critical",
    days_inactive: 45,
  },
  2: {
    merchant_id: 2,
    merchant_code: "MERCH002",
    name: "Gourmet Delights",
    category: "Food & Beverage",
    subcategory: "Fine Dining",
    city: "Los Angeles",
    country: "USA",
    registration_date: "2022-11-08",
    is_active: true,
    total_transactions: 12340,
    total_revenue: 285600,
    avg_transaction: 23.15,
    transaction_trend: -31.2,
    revenue_trend: -25.8,
    risk_score: 0.73,
    risk_level: "high",
    days_inactive: 28,
  },
  3: {
    merchant_id: 3,
    merchant_code: "MERCH003",
    name: "Urban Threads",
    category: "Retail",
    subcategory: "Fashion",
    city: "Chicago",
    country: "USA",
    registration_date: "2023-01-22",
    is_active: true,
    total_transactions: 9876,
    total_revenue: 198400,
    avg_transaction: 20.09,
    transaction_trend: -18.5,
    revenue_trend: -22.1,
    risk_score: 0.65,
    risk_level: "high",
    days_inactive: 21,
  },
  4: {
    merchant_id: 4,
    merchant_code: "MERCH004",
    name: "Wellness Hub",
    category: "Healthcare",
    subcategory: "Wellness Centers",
    city: "Miami",
    country: "USA",
    registration_date: "2022-08-30",
    is_active: true,
    total_transactions: 5432,
    total_revenue: 325890,
    avg_transaction: 59.99,
    transaction_trend: -12.3,
    revenue_trend: -8.9,
    risk_score: 0.52,
    risk_level: "medium",
    days_inactive: 14,
  },
  5: {
    merchant_id: 5,
    merchant_code: "MERCH005",
    name: "Quick Mart Express",
    category: "Retail",
    subcategory: "Convenience Stores",
    city: "Houston",
    country: "USA",
    registration_date: "2023-05-12",
    is_active: true,
    total_transactions: 18765,
    total_revenue: 156780,
    avg_transaction: 8.35,
    transaction_trend: -8.7,
    revenue_trend: -5.2,
    risk_score: 0.48,
    risk_level: "medium",
    days_inactive: 12,
  },
  6: {
    merchant_id: 6,
    merchant_code: "MERCH006",
    name: "Coffee Central",
    category: "Food & Beverage",
    subcategory: "Cafes",
    city: "Seattle",
    country: "USA",
    registration_date: "2022-06-18",
    is_active: true,
    total_transactions: 24567,
    total_revenue: 134500,
    avg_transaction: 5.47,
    transaction_trend: -3.2,
    revenue_trend: 2.1,
    risk_score: 0.34,
    risk_level: "low",
    days_inactive: 7,
  },
  7: {
    merchant_id: 7,
    merchant_code: "MERCH007",
    name: "Digital Dreams",
    category: "Electronics",
    subcategory: "Gaming",
    city: "San Francisco",
    country: "USA",
    registration_date: "2023-09-05",
    is_active: true,
    total_transactions: 6789,
    total_revenue: 489000,
    avg_transaction: 72.03,
    transaction_trend: 2.4,
    revenue_trend: 5.8,
    risk_score: 0.28,
    risk_level: "low",
    days_inactive: 5,
  },
  8: {
    merchant_id: 8,
    merchant_code: "MERCH008",
    name: "Fresh Foods Market",
    category: "Grocery",
    subcategory: "Supermarkets",
    city: "Boston",
    country: "USA",
    registration_date: "2022-04-25",
    is_active: true,
    total_transactions: 32456,
    total_revenue: 892300,
    avg_transaction: 27.49,
    transaction_trend: 8.6,
    revenue_trend: 12.3,
    risk_score: 0.22,
    risk_level: "low",
    days_inactive: 3,
  },
  9: {
    merchant_id: 9,
    merchant_code: "MERCH009",
    name: "Fitness First",
    category: "Healthcare",
    subcategory: "Gyms",
    city: "Denver",
    country: "USA",
    registration_date: "2023-02-14",
    is_active: false,
    total_transactions: 2345,
    total_revenue: 87650,
    avg_transaction: 37.38,
    transaction_trend: -65.2,
    revenue_trend: -72.1,
    risk_score: 0.95,
    risk_level: "critical",
    days_inactive: 90,
  },
  10: {
    merchant_id: 10,
    merchant_code: "MERCH010",
    name: "Book Nook",
    category: "Retail",
    subcategory: "Bookstores",
    city: "Portland",
    country: "USA",
    registration_date: "2022-12-01",
    is_active: true,
    total_transactions: 7654,
    total_revenue: 145670,
    avg_transaction: 19.03,
    transaction_trend: 4.5,
    revenue_trend: 6.8,
    risk_score: 0.25,
    risk_level: "low",
    days_inactive: 4,
  },
};

export function getDemoMerchantDetail(merchantId: number): DemoMerchantDetail | null {
  return DEMO_MERCHANT_DETAILS[merchantId] || null;
}

