import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

/**
 * Region entity representing a sales region
 */
@Entity()
export class Region {
  /** Primary key */
  @PrimaryGeneratedColumn()
  id: number;

  /** Region name (unique) */
  @Column({ unique: true })
  name: string;

  /** Orders placed in this region */
  @OneToMany(() => Order, order => order.region)
  orders: Order[];
} 