import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema.js';
import { createProductDto } from './dto/create-product.dto.js';
import { updateProductDto } from './dto/update-product.dto.js';

@Injectable() // Penanda agar kelas ini bisa disuntikkan otomatis oleh NestJS
export class ProductsService {
  // Menyuntikkan Model Product → pengganti array products
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // READ semua
  findAll() {
    return this.productModel.find();
  }

  // READ satu
  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // CREATE (_id dibuat otomatis oleh MongoDB, tidak perlu Math.max lagi)
  create(data: createProductDto) {
    return this.productModel.create(data);
  }

  // UPDATE
  async update(id: string, data: updateProductDto) {
    // { new: true } → yang dikembalikan adalah data SESUDAH diubah
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // DELETE
  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return {
      message: 'Product deleted successfully',
      product,
    };
  }
}
