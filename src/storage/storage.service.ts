import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import sharp, { fit } from 'sharp';

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    try {
      // 1. Optimasi Gambar menggunakan Sharp
      const optimizeBuffer = await sharp(file.buffer)
        .resize(500, 500, {
          fit: 'inside', // Mengubah resolusi maksimal ke 500x500 piksel
        })
        .webp({ quality: 80 }) // Mengonversi format ke WebP dengan kualitas 80%
        .toBuffer();

      // 2. Proses Unggah Buffer ke Cloudinary via Promise Stream
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) {
              console.error('[cloudinary]', error && JSON.stringify({m:error.message,c:error.http_code,n:error.name}));
              return reject(
                new InternalServerErrorException(
                  'Failed to upload file to cloudinary',
                ),
              );
            }
            resolve(result.secure_url); // Mengembalikan URL HTTPS aman dari Cloudinary
          },
        );
        // 3. Menulis buffer gambar ke dalam stream dan menutupnya
        uploadStream.end(optimizeBuffer);
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Compression or upload process failed',
      );
    }
  }
}
