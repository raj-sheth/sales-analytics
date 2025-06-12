// Root service for the Sales Analytics API
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a hello world string (health check)
   */
  getHello(): string {
    return 'Hello World!';
  }
}
