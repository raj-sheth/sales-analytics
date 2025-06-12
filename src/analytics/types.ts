/**
 * Response for total revenue calculation
 */
export interface TotalRevenueResponse {
  totalRevenue: number;
}

/**
 * Response for grouped revenue calculation (by product, category, or region)
 */
export interface GroupedRevenueResponse {
  name: string;
  revenue: number;
}

/**
 * Union type for revenue responses (total or grouped)
 */
export type RevenueResponse = TotalRevenueResponse | GroupedRevenueResponse[];

/**
 * Response for a top product (by quantity sold)
 */
export interface TopProductResponse {
  name: string;
  totalQuantity: number;
}

/**
 * Array of top product responses
 */
export type TopProductsResponse = TopProductResponse[];

/**
 * Response for customer analytics (count, orders, average order value)
 */
export interface CustomerAnalysisResponse {
  totalCustomers: number;
  totalOrders: number;
  avgOrderValue: number;
} 