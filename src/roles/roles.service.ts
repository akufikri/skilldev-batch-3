import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { Role } from './schema/role.schema.js';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  // CREATE
  async create(createRoleDto: CreateRoleDto) {
    return this.roleModel.create(createRoleDto);
  }

  // READ (ALL)
  async findAll() {
    return this.roleModel.find();
  }

  // READ (ONE)
  async findOne(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  // UPDATE
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, {
      new: true,
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  // DELETE
  async delete(id: string) {
    const role = await this.roleModel.findByIdAndDelete(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return { message: 'Role deleted' };
  }
}
