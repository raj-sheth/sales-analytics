import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString } from 'class-validator';

/**
 * DTO for creating an order
 */
export class CreateOrderDto {
  @ApiProperty({ example: '1001', description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsNumber()
  customer: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  product: number;

  @ApiProperty({ example: 1, description: 'Region ID' })
  @IsNumber()
  region: number;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z', description: 'Date of sale' })
  @IsDateString()
  dateOfSale: Date;

  @ApiProperty({ example: 2, description: 'Quantity sold' })
  @IsNumber()
  quantitySold: number;

  @ApiProperty({ example: 0.1, description: 'Discount' })
  @IsNumber()
  discount: number;

  @ApiProperty({ example: 10.0, description: 'Shipping cost' })
  @IsNumber()
  shippingCost: number;

  @ApiProperty({ example: 'Credit Card', description: 'Payment method' })
  @IsString()
  paymentMethod: string;
} 