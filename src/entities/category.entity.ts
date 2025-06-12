import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

/**
 * Category entity representing a product category
 */
@Entity()
export class Category {
  /** Primary key */
  @PrimaryGeneratedColumn()
  id: number;

  /** Category name (unique) */
  @Column({ unique: true })
  name: string;

  /** Products belonging to this category */
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
} 