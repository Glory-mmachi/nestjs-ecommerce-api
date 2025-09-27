import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async getProduct(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      return new ProductResponseDto(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch product, please try again`,
      );
    }
  }

  async createProduct(data: CreateProductDto) {
    const product = await this.prisma.product.create({ data: { ...data } });
    return new ProductResponseDto(product);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product not found`);
    }
    const product = await this.prisma.product.update({ where: { id }, data });
    return product;
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return;
  }
}
