import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [ProductResponseDto],
  })
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product fetched successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  // @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    //IMPLEMENT ROLE GUARD
    const { role } = req.user;
    if (role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admins are allowed to perform this action',
      );
    }
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    //IMPLEMENT ROLE GUARD
    const { role } = req['user'];
    if (role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admins are allowed to perform this action',
      );
    }
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string, @Req() req: any) {
    //IMPLEMENT ROLE GUARD
    const { role } = req['user'];
    if (role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admins are allowed to perform this action',
      );
    }
    await this.productsService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}
