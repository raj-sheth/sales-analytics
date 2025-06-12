import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

/**
 * DTO for updating an order (all fields optional)
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {} 