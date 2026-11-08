// test/products.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'; // Digunakan untuk membuat testing module dan menentukan tipe modul pengujian NestJS
// INestApplication: tipe instance aplikasi NestJS
// ValidationPipe: memvalidasi dan mentransformasi data request berdasarkan DTO
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // Library untuk mengirim HTTP request dan menguji response tanpa menjalankan server secara manual di port tertentu
import { AppModule } from '../src/app.module.js'; // Mengimpor modul utama aplikasi yang akan digunakan dalam pengujian E2E
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js'; // Mengimpor interceptor kustom untuk memproses request atau response sesuai implementasinya

describe('Product Controller (E2E Test)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // ⚠️ SANGAT PENTING: Pasang kembali pipe dan interceptor global di aplikasi virtual ini
    // Jika dilewatkan, E2E test tidak akan melewati proses validasi DTO dan pemformatan JSON kita!

    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });
  afterAll(async () => {
    await app.close(); // Tutup aplikasi virtual setelah tes selesai agar tidak bocor di memori
  });

  it('GET /products --> Should be return data standard unified response format', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200) // 🎯 Memastikan status HTTP yang keluar adalah 200 OK
      .expect((res) => {
        // Memastikan interceptor kita sukses membungkus payload data murni menjadi standard response
        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('data');
      });
  });
  it('POST /products --> Should trigger 400 Bad Request when validation DTO fails', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ title: '', price: -100 })
      .expect(400) // 🎯 Memastikan jaring pengaman ValidationPipe otomatis menolak request ini
      .expect((res) => {
        const body = res.body as Record<string, unknown>;
        expect(body.error).toBeDefined();
      });
  });
});
