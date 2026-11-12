import { SetMetadata } from '@nestjs/common';

// String kunci rahasia untuk menyimpan metadata role
export const ROLE_KEY = 'roles';

// 💡 Decorator ini digunakan di atas method Controller untuk menentukan role apa saja yang diizinkan
export const Roles = (...roles: string[]) => SetMetadata(ROLE_KEY, roles);
