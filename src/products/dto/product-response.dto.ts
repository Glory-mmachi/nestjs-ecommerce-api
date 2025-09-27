import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  imageUrl?: string | null;

  @ApiProperty()
  createdAt: Date;
  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
