import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Controller('roles')
export class RolesController {
  constructor(private rolesServices: RolesService) {}

  // ENDPOINT CREATE
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesServices.create(createRoleDto);
  }

  // ENDPOINT GET ALL
  @Get()
  findAll() {
    return this.rolesServices.findAll();
  }
  // ENDPOINT GET ONE
  @Get(':id')
  findOne(@Param(':id') id: string) {
    return this.rolesServices.findOne(id);
  }

  // ENDPOINT UPDATE
  @Patch(':id')
  update(@Param(':id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesServices.update(id, updateRoleDto);
  }

  // ENDPOINT DELETE
  @Delete(':id')
  remove(@Param(':id') id: string) {
    return this.rolesServices.delete(id);
  }
}
