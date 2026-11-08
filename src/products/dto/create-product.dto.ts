import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createProductDto {
  @ApiProperty({
    description: 'Title or name of the product',
    example: 'Matcha latte',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiPropertyOptional({
    description: 'Image(s) of the product',
    example: '[https://example.com/image.jpg]',
  })
  @IsArray()
  @IsUrl({}, { each: true, message: 'Images must be valid URL' })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Price of the product',
    example: 1000,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price: number;

  @ApiProperty({
    description: 'Stock of the product',
    example: 10,
  })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @ApiProperty({
    description: 'Brand of the product',
    example: 'Coffee',
  })
  @IsString()
  @IsNotEmpty({ message: 'Brand is required' })
  brand: string;

  @ApiProperty({
    description: 'Category of the product',
    example: 'Drink',
  })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @ApiPropertyOptional({
    description: 'Product description (optional)',
    example: 'Matcha latte best seller products',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
