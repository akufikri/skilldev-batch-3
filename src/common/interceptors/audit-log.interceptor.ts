import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AuditLogService } from '../../audit-logs/audit-logs.service.js';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface.js';

interface AuditLogPayload {
  method: string;
  url: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string;
  userAgent: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // 🧱 1. Tangkap objek HTTP Request dan Response
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithUser>();
    const response = httpContext.getResponse<Response>();

    // 🧱 2. Catat Waktu Awal Request Masuk
    const startTime = Date.now();

    // 🧱 3. Ekstraksi Informasi HTTP Dasar
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || 'Unknown';

    // 🧱 4. Ekstraksi Data User Aktif (ditempelkan oleh JwtAuthGuard sebelumnya)
    // Menggunakan opsional chaining (?.) agar aman jika endpoint bersifat publik (anonim)
    const activeUser: JwtPayload | undefined = request['user'];

    // 🧱 5. Eksekusi Handler/Controller, lalu tangkap hasilnya via RxJS tap()
    return next.handle().pipe(
      tap(() => {
        // pisahkan fungsi agar dapat diproses asynchronus
        void this.saveLog(request, response, startTime, activeUser, {
          method,
          originalUrl,
          ip: ip || request.socket.remoteAddress || '127.0.0.1',
          userAgent,
        });
      }),
    );
  }

  private async saveLog(
    _request: RequestWithUser, // awali dengan _ karena argument ini tidak dipakai
    response: Response,
    startTime: number,
    activeUser: JwtPayload | undefined,
    meta: {
      method: string;
      originalUrl: string;
      ip: string;
      userAgent: string;
    },
  ): Promise<void> {
    // Hitung total waktu pemrosesan (Response Time) dalam ms
    const responseTimeMs = Date.now() - startTime;
    const statusCode = response.statusCode;

    // 🧱 6. Susun Objek Audit Log lengkap
    const logPayload: AuditLogPayload = {
      method: meta.method, // POST, GET, DELETE, etc...
      url: meta.originalUrl, // /products, /categories
      statusCode, // 200, 201, 404, 401
      responseTimeMs,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      userId: activeUser?.sub, // 1, userId : undifined
      userEmail: activeUser?.email,
      userRole: activeUser?.role,
    };

    // 🧱 7. Simpan secara otomatis ke MongoDB
    try {
      await this.auditLogsService.createLog(logPayload);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Fail to save Audit Log to MongoDB:', error);
    }
  }
}
