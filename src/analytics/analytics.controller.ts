import { Controller, Post, Get, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyticsService } from './analytics.service';
import { DataLoaderService } from './data-loader.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { TopProductsDto } from './dto/top-products.dto';
import { RevenueResponse, TopProductsResponse, CustomerAnalysisResponse } from './types';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

/**
 * Controller for analytics endpoints (revenue, top products, customer analysis, data upload)
 */
@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly dataLoaderService: DataLoaderService,
  ) {}

  /**
   * Upload a CSV file containing sales data
   */
  @ApiOperation({ summary: 'Upload sales CSV data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'CSV file', type: UploadFileDto })
  @ApiResponse({ status: 201, description: 'Data loaded successfully.' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ message: string }> {
    await this.dataLoaderService.loadDataFromCSV(file.path);
    return { message: 'Data loaded successfully' };
  }

  /**
   * Get revenue analytics for a date range, optionally grouped
   */
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['product', 'category', 'region'] })
  @ApiResponse({ status: 200, description: 'Revenue analytics', type: Object })
  @Get('revenue')
  async getRevenue(
    @Query() dateRange: DateRangeDto,
    @Query('groupBy') groupBy?: 'product' | 'category' | 'region',
  ): Promise<RevenueResponse> {
    return this.analyticsService.getRevenue(
      dateRange.startDate,
      dateRange.endDate,
      groupBy,
    );
  }

  /**
   * Get top N products by quantity sold
   */
  @ApiOperation({ summary: 'Get top N products' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'region', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Top products', type: Array })
  @Get('top-products')
  async getTopProducts(
    @Query() query: TopProductsDto,
  ): Promise<TopProductsResponse> {
    return this.analyticsService.getTopProducts(
      query.startDate,
      query.endDate,
      query.limit,
      query.category,
      query.region,
    );
  }

  /**
   * Get customer analytics (total customers, orders, average order value)
   */
  @ApiOperation({ summary: 'Get customer analytics' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Customer analytics', type: Object })
  @Get('customer-analysis')
  async getCustomerAnalysis(
    @Query() dateRange: DateRangeDto,
  ): Promise<CustomerAnalysisResponse> {
    return this.analyticsService.getCustomerAnalysis(
      dateRange.startDate,
      dateRange.endDate,
    );
  }
} 