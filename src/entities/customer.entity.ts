import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

/**
 * Customer entity representing a buyer
 */
@Entity()
export class Customer {
  /** Primary key */
  @PrimaryGeneratedColumn()
  id: number;

  /** Unique customer identifier (from source system) */
  @Column()
  customerId: string;

  /** Customer name */
  @Column()
  name: string;

  /** Customer email address */
  @Column()
  email: string;

  /** Customer address */
  @Column()
  address: string;

  /** Orders placed by this customer */
  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
} 