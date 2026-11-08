import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    required: true,
    description: 'Name or title of the roles',
    example: 'Admin',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
