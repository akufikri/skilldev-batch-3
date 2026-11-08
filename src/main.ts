import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dns from 'node:dns/promises';

async function bootstrap() {
  // Mitigasi internal Node.js: Set server DNS publik jika didefinisikan di .env
  const dnsServer = process.env['NODE_DNS_SERVER'];

  if (dnsServer) {
    dns.setServers([dnsServer]);
    console.log(
      `[DNS] Nodejs internal server dns resolver di alihkan ke ${dnsServer}`,
    );
  }
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'https://pos.skildev.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // 📝 1. Konfigurasi Dasar Informasi API POS
  const config = new DocumentBuilder()
    .setTitle('POS Backend Enterprise')
    .setDescription(
      'Dokumentasi API Sistem Kasir Terintegrasi untuk Skildev Bootcamp',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // 📝 2. Inisialisasi Dokumen Swagger ke Endpoint /docs
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // 👈 Halaman dokumentasi bisa diakses di http://localhost:3000/docs

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 🛡️ Aktifkan Jaring Pengaman Validasi Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Otomatis membuang properti gaib yang tidak ada di DTO
      forbidNonWhitelisted: true, // Langsung tolak request jika nekat mengirim data asing
      transform: true, // Otomatis mengonversi tipe data string URL menjadi tipe number jika sesuai
      transformOptions: { enableImplicitConversion: true }, // form-data selalu kirim string, konversi ke tipe DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
