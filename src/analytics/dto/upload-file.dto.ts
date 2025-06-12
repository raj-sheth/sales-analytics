import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for uploading a sales CSV file
 */
export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'CSV file to upload' })
  @IsNotEmpty()
  file: Express.Multer.File;
} 