import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  method!: string; // Misal: 'POST', 'PUT', 'DELETE'

  @Prop({ required: true })
  url!: string; // Misal: '/products'

  @Prop({ required: true })
  statusCode!: number; // Misal: 200, 201, 403, 500

  @Prop({ required: true })
  responseTimeMs!: number; // Durasi eksekusi dalam milidetik (ms)

  @Prop({ required: true })
  ipAddress!: string; // Alamat IP Klien

  @Prop()
  userAgent!: string; // Informasi Browser / Device Klien

  // Data Identitas Pengguna (diambil dari req.user)
  @Prop()
  userId?: string;

  @Prop()
  userEmail?: string;

  @Prop()
  userRole?: string;
}
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
