import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoriesDto } from './dto/create-categories.dto.js';
import { UpdateCategoriesDto } from './dto/update-categories.dto.js';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';

@Controller('categories')
// 💡 Menerapkan cache otomatis untuk seluruh endpoint GET di dalam controller ini
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private categoriesServices: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoriesDto) {
    return this.categoriesServices.creates(createCategoryDto);
  }

  @Get()
  @CacheKey('categories_key')
  @CacheTTL(300 * 1000) // Khusus data kategori ini disimpan selama 5 menit
  findAll() {
    return this.categoriesServices.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesServices.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoriesDto,
  ) {
    return this.categoriesServices.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesServices.delete(id);
  }
}
