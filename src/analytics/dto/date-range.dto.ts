import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for specifying a date range
 */
export class DateRangeDto {
  @ApiProperty({ example: '2024-01-01', description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-06-01', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;
} 