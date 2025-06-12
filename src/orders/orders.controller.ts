import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderResponse } from './types';

/**
 * Controller for order management endpoints
 */
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created.', type: OrderResponse })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of orders.', type: [OrderResponse] })
  @Get()
  findAll(): Promise<OrderResponse[]> {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Order updated.', type: OrderResponse })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponse> {
    return this.ordersService.update(id, updateOrderDto);
  }
} 