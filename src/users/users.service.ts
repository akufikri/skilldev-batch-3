import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/users.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 1. Membuat user baru
  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // 2. Mengambil semua data user (lengkap dengan data role)
  async findAll() {
    return this.userModel.find().populate('roleId').exec();
  }

  // 3. Mengambil 1 user berdasarkan ID Mongo (_id)
  async findOne(id: string) {
    const user = await this.userModel.findById(id).populate('roleId').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 4. Mencari user berdasarkan Email (dengan opsi menyertakan passwordHash untuk auth)
  findByEmail(email: string, isIncludePassword = false) {
    const query = this.userModel.findOne({ email }).populate('roleId');

    if (isIncludePassword) {
      query.select('+passwordHash');
    }

    return query.exec();
  }

  // 5. Mengubah data user
  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // 6. Menghapus user
  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
