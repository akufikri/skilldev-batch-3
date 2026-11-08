import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { Categories, CategoriesSchema } from './schemas/categories.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categories.name, schema: CategoriesSchema },
    ]),
  ],

  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
