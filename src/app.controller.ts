// Root controller for the Sales Analytics API
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * @returns {string} Hello World!
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
