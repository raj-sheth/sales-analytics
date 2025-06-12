// Analytics feature module
// Registers analytics controller, services, and TypeORM entities
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DataLoaderService } from './data-loader.service';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Category } from '../entities/category.entity';
import { Region } from '../entities/region.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Customer, Category, Region]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, DataLoaderService],
  exports: [AnalyticsService, DataLoaderService],
})
export class AnalyticsModule {} 