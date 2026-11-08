import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Tipe dokumen hasil query (Product + _id + method Mongoose)
export type ProductDocument = HydratedDocument<Product>;

// timestamps: true → otomatis membuat createdAt & updatedAt
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  // Daftar URL gambar dari Cloudinary
  @Prop({ type: [String], default: [] })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
