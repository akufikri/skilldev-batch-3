import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// timestamps: true → otomatis membuat createdAt & updatedAt
@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
