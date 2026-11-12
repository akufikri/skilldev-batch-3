import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  JwtPayload,
  RequestWithUser,
} from '../interfaces/jwt-payload.interface.js';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // 💡 Fungsi canActivate() beserta params-nya ini OTOMATIS dieksekusi NestJS setiap kali endpoint dipanggil

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Ambil objek HTTP Request dari konteks eksekusi
    const request = context
      .switchToHttp()
      .getRequest<Request & RequestWithUser>();
    // 2. Ekstrak string token dari Header 'Authorization: Bearer <token>'
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Access Denied! Token not provided in Authorization Header',
      );
    }

    try {
      // 3. Verifikasi keaslian token menggunakan kunci rahasia server
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      // 4. TEMPELKAN data payload (user) ke objek 'request'
      // Langkah ini sangat penting agar Guard berikutnya (RolesGuard) dan Controller bisa membaca data user aktif!

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token invalid or expired');
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
