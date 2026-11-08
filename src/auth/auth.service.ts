import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. pengecekan email user apakah sudah ter daptar
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(dto.passwordHash, 12);

    // 3. Buat user baru
    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'CASHIER',
    });
    return {
      message: 'Registration sucessfull',
      user: new UserEntity(user.toObject()),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // 401
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken, user: new UserEntity(user.toObject()) };
  }
}
