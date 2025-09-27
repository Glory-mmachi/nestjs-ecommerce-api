import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Wireless Mouse',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'A sleek and ergonomic wireless mouse with USB receiver.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the product (up to 2 decimal places)',
    example: 29.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Stock quantity available',
    example: 150,
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiPropertyOptional({
    description: 'URL of the product image',
    example: 'https://example.com/images/mouse.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
