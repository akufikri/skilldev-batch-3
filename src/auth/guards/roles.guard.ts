import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator.js';
import { RequestWithUser } from '../interfaces/jwt-payload.interface.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Baca daftar role yang diizinkan dari decorator @Roles(...) di atas method Controller
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler,
      context.getClass,
    ]);

    // Jika endpoint tersebut TIDAK dipasangi @Roles(), artinya endpoint boleh diakses oleh semua role yang terautentikasi
    if (!requiredRoles) {
      return true;
    }

    // 2. Ambil data user yang sebelumnya sudah ditempelkan oleh JwtAuthGuard di req.user
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    // 3. Periksa apakah role milik user termasuk dalam daftar role yang diizinkan
    const isAllowed = requiredRoles.includes(user?.role ?? 'CASHIER');

    if (!isAllowed) {
      // Jika role tidak cocok (misal: Kasir coba akses menu Manager), lemparkan Error 403 Forbidden!
      throw new ForbiddenException(
        'You do not have permission to access this resource. Your role is not authorized.',
      );
    }
    return true;
  }
}
