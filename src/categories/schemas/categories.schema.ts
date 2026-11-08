import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Categories {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
