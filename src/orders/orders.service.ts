import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponse } from './types';

/**
 * Service for order management logic
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * Create a new order
   */
  async create(createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  /**
   * Get all orders
   */
  async findAll(): Promise<OrderResponse[]> {
    return this.orderRepository.find();
  }

  /**
   * Update an order by ID
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponse> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOneBy({ id });
  }
} 