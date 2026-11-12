import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { createProductDto } from './dto/create-product.dto.js';
import { updateProductDto } from './dto/update-product.dto.js';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StorageService } from '../storage/storage.service.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Products Managements') // 👈 Mengelompokkan semua rute produk ke dalam satu folder/grup di UI
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products') // Mengatur rute dasar URL: http://localhost:3000/products
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get product',
    description: 'Get product into pos system',
  })
  @ApiResponse({ status: 200, description: 'Get data successfull' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  getAllProducts() {
    return this.productService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({
    summary: 'Create product',
    description: 'Add new product into pos system',
  })
  @ApiResponse({ status: 201, description: 'Operation successfull' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createProductDto: createProductDto,
  ) {
    const imageUrl: string[] = [];
    if (images && images.length > 0) {
      for (const img of images) {
        // 👇 di materi asli tertulis uploadFile(), padahal nama method di StorageService adalah uploadProductImage()
        const url = await this.storageService.uploadProductImage(img);
        imageUrl.push(url);
      }
    }
    return this.productService.create({
      ...createProductDto,
      images: imageUrl,
    });
  }

  @Get(':id') // Handle: GET /products/:id (Ambil Satu Produk secara Spesifik)
  @ApiOperation({
    summary: 'Get one product',
  })
  @ApiParam({ name: 'id', description: 'Unique product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Operation successful' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  findOneProduct(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id') // Handle: PATCH /products/:id (Update Produk)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: updateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
