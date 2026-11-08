import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriesDto {
  @ApiProperty({
    required: true,
    description: 'Title or name of categories',
    example: 'Food',
  })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty({
    required: false,
    description: 'Description of categories',
    example: 'Food',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
