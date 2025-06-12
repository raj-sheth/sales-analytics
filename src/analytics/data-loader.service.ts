import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Category } from '../entities/category.entity';
import { Region } from '../entities/region.entity';

/**
 * Interface representing a row in the sales CSV file.
 */
interface CSVRecord {
  OrderID: string;
  ProductID: string;
  CustomerID: string;
  ProductName: string;
  Category: string;
  Region: string;
  DateOfSale: string;
  QuantitySold: string;
  UnitPrice: string;
  Discount: string;
  ShippingCost: string;
  PaymentMethod: string;
  CustomerName: string;
  CustomerEmail: string;
  CustomerAddress: string;
}

/**
 * Service for loading and processing sales data from CSV files into the database.
 * Handles normalization, validation, and upserts for related entities.
 */
@Injectable()
export class DataLoaderService {
  private readonly logger = new Logger(DataLoaderService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  /**
   * Loads sales data from a CSV file and saves it to the database.
   * @param filePath Path to the CSV file
   */
  async loadDataFromCSV(filePath: string): Promise<void> {
    try {
      const records: CSVRecord[] = [];
      const parser = createReadStream(filePath).pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
        }),
      );

      for await (const record of parser) {
        records.push(record as CSVRecord);
      }

      await this.processRecords(records);
      this.logger.log('Data loading completed successfully');
    } catch (error) {
      this.logger.error('Error loading data from CSV:', error);
      throw error;
    }
  }

  /**
   * Processes and saves each record from the CSV file, handling normalization and upserts.
   * @param records Array of CSVRecord objects
   */
  private async processRecords(records: CSVRecord[]): Promise<void> {
    for (const record of records) {
      // Create or update category
      let category = await this.categoryRepository.findOne({
        where: { name: record.Category },
      });
      if (!category) {
        category = this.categoryRepository.create({ name: record.Category });
        await this.categoryRepository.save(category);
      }

      // Create or update region
      let region = await this.regionRepository.findOne({
        where: { name: record.Region },
      });
      if (!region) {
        region = this.regionRepository.create({ name: record.Region });
        await this.regionRepository.save(region);
      }

      // Create or update customer
      let customer = await this.customerRepository.findOne({
        where: { customerId: record.CustomerID },
      });
      if (!customer) {
        customer = this.customerRepository.create({
          customerId: record.CustomerID,
          name: record.CustomerName,
          email: record.CustomerEmail,
          address: record.CustomerAddress,
        });
        await this.customerRepository.save(customer);
      }

      // Create or update product
      let product = await this.productRepository.findOne({
        where: { productId: record.ProductID },
      });
      if (!product) {
        product = this.productRepository.create({
          productId: record.ProductID,
          name: record.ProductName,
          unitPrice: parseFloat(record.UnitPrice),
          category,
        });
        await this.productRepository.save(product);
      }

      // Create order
      const order = this.orderRepository.create({
        orderId: record.OrderID,
        customer,
        product,
        region,
        dateOfSale: new Date(record.DateOfSale),
        quantitySold: parseInt(record.QuantitySold),
        discount: parseFloat(record.Discount),
        shippingCost: parseFloat(record.ShippingCost),
        paymentMethod: record.PaymentMethod,
      });
      await this.orderRepository.save(order);
    }
  }
} 