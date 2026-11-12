import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { StorageModule } from '../storage/storage.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    StorageModule, // Tambahkan ini
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
