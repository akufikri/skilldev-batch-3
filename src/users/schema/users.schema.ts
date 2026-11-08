import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../roles/schema/role.schema.js';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  // select: false memastikan password tidak dikembalikan saat query normal
  @Prop({ required: true, select: false })
  passwordHash!: string;

  // Relasi ke koleksi Role
  @Prop({ type: Types.ObjectId, ref: Role.name, required: false })
  roleId?: Types.ObjectId;

  @Prop({ required: false, default: 'CASHIER', enum: ['ADMIN', 'CASHIER'] })
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
