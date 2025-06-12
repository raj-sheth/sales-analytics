import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Order } from './order.entity';

/**
 * Product entity representing an item for sale
 */
@Entity()
export class Product {
  /** Primary key */
  @PrimaryGeneratedColumn()
  id: number;

  /** Unique product identifier (from source system) */
  @Column()
  productId: string;

  /** Product name */
  @Column()
  name: string;

  /** Unit price of the product */
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  /** Category to which the product belongs */
  @ManyToOne(() => Category, category => category.products)
  category: Category;

  /** Orders that include this product */
  @OneToMany(() => Order, order => order.product)
  orders: Order[];
} 