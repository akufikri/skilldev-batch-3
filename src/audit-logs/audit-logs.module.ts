import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema.js';
import { AuditLogService } from './audit-logs.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogService },
    ]),
  ],
  providers: [AuditLogService],
  exports: [AuditLogService], // Export agar bisa digunakan oleh Interceptor
})
export class auditLogModule {}
