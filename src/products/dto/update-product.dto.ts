import { PartialType } from '@nestjs/mapped-types';

import { createProductDto } from './create-product.dto.js';

export class updateProductDto extends PartialType(createProductDto) {}
