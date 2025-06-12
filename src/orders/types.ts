/**
 * Type for order API responses
 */
export interface OrderResponse {
  id: number;
  orderId: string;
  customer: any;
  product: any;
  region: any;
  dateOfSale: Date;
  quantitySold: number;
  discount: number;
  shippingCost: number;
  paymentMethod: string;
} 