import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoriesDto } from './dto/create-categories.dto.js';
import { UpdateCategoriesDto } from './dto/update-categories.dto.js';
import { Categories } from './schemas/categories.schema.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
  ) {}

  //   GET
  async findAll() {
    return this.categoriesModel.find();
  }
  //   POST
  async creates(createCategoriesDto: CreateCategoriesDto) {
    return this.categoriesModel.create(createCategoriesDto);
  }
  //   GET:ID
  async findOne(id: string) {
    const category = await this.categoriesModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
  //   PUT
  async update(id: string, updateCategoriesDto: UpdateCategoriesDto) {
    const category = await this.categoriesModel.findByIdAndUpdate(
      id,
      updateCategoriesDto,
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
  //   DELETE
  async delete(id: string) {
    const category = await this.categoriesModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted' };
  }
}
