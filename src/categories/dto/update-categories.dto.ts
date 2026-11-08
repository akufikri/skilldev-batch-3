import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesDto } from './create-categories.dto.js';

export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto) {}
