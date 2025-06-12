import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { Region } from './region.entity';

/**
 * Order entity representing a sales transaction
 */
@Entity()
export class Order {
  /** Primary key */
  @PrimaryGeneratedColumn()
  id: number;

  /** Unique order identifier (from source system) */
  @Column()
  orderId: string;

  /** Customer who placed the order */
  @ManyToOne(() => Customer, customer => customer.orders)
  customer: Customer;

  /** Product that was sold */
  @ManyToOne(() => Product, product => product.orders)
  product: Product;

  /** Region where the order was placed */
  @ManyToOne(() => Region, region => region.orders)
  region: Region;

  /** Date of sale */
  @CreateDateColumn()
  dateOfSale: Date;

  /** Quantity sold */
  @Column()
  quantitySold: number;

  /** Discount applied to the order */
  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  /** Shipping cost for the order */
  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  /** Payment method used */
  @Column()
  paymentMethod: string;
} 