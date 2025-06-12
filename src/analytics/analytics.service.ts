import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Region } from '../entities/region.entity';
import { RevenueResponse, TotalRevenueResponse, GroupedRevenueResponse, TopProductsResponse, CustomerAnalysisResponse } from './types';

/**
 * Service for analytics calculations (revenue, top products, customer analysis)
 */
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  /**
   * Get revenue analytics for a date range, optionally grouped by product, category, or region
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @param groupBy Optional grouping ('product', 'category', 'region')
   */
  async getRevenue(
    startDate: string,
    endDate: string,
    groupBy?: 'product' | 'category' | 'region',
  ): Promise<RevenueResponse> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('order.region', 'region')
      .where('order.dateOfSale BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (groupBy === 'product') {
      const result = await queryBuilder
        .select('product.name', 'name')
        .addSelect('SUM(order.quantitySold * product.unitPrice)', 'revenue')
        .groupBy('product.name')
        .getRawMany<GroupedRevenueResponse>();
      return result;
    } else if (groupBy === 'category') {
      const result = await queryBuilder
        .select('category.name', 'name')
        .addSelect('SUM(order.quantitySold * product.unitPrice)', 'revenue')
        .groupBy('category.name')
        .getRawMany<GroupedRevenueResponse>();
      return result;
    } else if (groupBy === 'region') {
      const result = await queryBuilder
        .select('region.name', 'name')
        .addSelect('SUM(order.quantitySold * product.unitPrice)', 'revenue')
        .groupBy('region.name')
        .getRawMany<GroupedRevenueResponse>();
      return result;
    }

    const result = await queryBuilder
      .select('SUM(order.quantitySold * product.unitPrice)', 'totalRevenue')
      .getRawOne<TotalRevenueResponse>();
    return result || { totalRevenue: 0 };
  }

  /**
   * Get top N products by quantity sold for a date range, with optional filters
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @param limit Number of products to return (default: 10)
   * @param category Optional category filter
   * @param region Optional region filter
   */
  async getTopProducts(
    startDate: string,
    endDate: string,
    limit: number = 10,
    category?: string,
    region?: string,
  ): Promise<TopProductsResponse> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('order.region', 'region')
      .where('order.dateOfSale BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (category) {
      queryBuilder.andWhere('category.name = :category', { category });
    }

    if (region) {
      queryBuilder.andWhere('region.name = :region', { region });
    }

    return queryBuilder
      .select('product.name', 'name')
      .addSelect('SUM(order.quantitySold)', 'totalQuantity')
      .groupBy('product.name')
      .orderBy('totalQuantity', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /**
   * Get customer analytics (total customers, total orders, average order value) for a date range
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   */
  async getCustomerAnalysis(
    startDate: string,
    endDate: string,
  ): Promise<CustomerAnalysisResponse> {
    const [totalCustomers, totalOrders, avgOrderValue] = await Promise.all([
      this.orderRepository
        .createQueryBuilder('order')
        .select('COUNT(DISTINCT order.customer)', 'totalCustomers')
        .where('order.dateOfSale BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .getRawOne<{ totalCustomers: string }>(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('COUNT(order.id)', 'totalOrders')
        .where('order.dateOfSale BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .getRawOne<{ totalOrders: string }>(),
      this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.product', 'product')
        .select('AVG(order.quantitySold * product.unitPrice)', 'avgOrderValue')
        .where('order.dateOfSale BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .getRawOne<{ avgOrderValue: string }>(),
    ]);

    return {
      totalCustomers: parseInt(totalCustomers?.totalCustomers || '0'),
      totalOrders: parseInt(totalOrders?.totalOrders || '0'),
      avgOrderValue: parseFloat(avgOrderValue?.avgOrderValue || '0'),
    };
  }
} 