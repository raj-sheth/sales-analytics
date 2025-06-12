// Main application module for the Sales Analytics API
// Sets up TypeORM, imports analytics and entity modules, and registers controllers/services
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './common/config/database.config';
import { AnalyticsModule } from './analytics/analytics.module';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { Category } from './entities/category.entity';
import { Region } from './entities/region.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Global TypeORM config and entity registration
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Order, Product, Customer, Category, Region]),
    // Analytics feature module
    AnalyticsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
