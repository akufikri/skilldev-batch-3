import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';

// Kelompok besar pengujian untuk komponen ProductsService
describe('ProductService (Unit test)', () => {
  let service: ProductsService;

  // Diaktifkan setiap sebelum unit-unit 'it()' di bawah dieksekusi
  beforeEach(async () => {
    // Membuat modul virtual NestJS yang terisolasi khusus untuk uji coba
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService], // Mendaftarkan service kita secara mandiri
    }).compile();

    // Mengambil instansiasi class ProductsService dari dalam modul virtual
    service = module.get<ProductsService>(ProductsService);
  });

  // 🟢 Unit 1: Memastikan sistem Dependency Injection NestJS tidak pecah
  it('should be definded', () => {
    expect(service).toBeDefined(); // Menegaskan bahwa class service berhasil tercipta
  });

  // 🟦 Kelompok kecil khusus menguji fungsi pembuatan produk

  describe('create()', () => {
    it('should successfully create a new product retail data', () => {
      // 1. Siapkan data tiruan peniru DTO
      const dto = {
        title: 'Coffe latte',
        price: 12000,
        stock: 20,
        brand: 'Coffee',
        category: 'Coffee',
      };

      // 2. Jalankan fungsi asli yang ada di dalam service
      const result = service.create(dto);

      // 3. Tegaskan ekspektasi hasil akhirnya menggunakan matcher Jest
      expect(result).toHaveProperty('id'); // Hasil wajib punya properti id otomatis
      expect(result.title).toEqual('Coffe latte'); // Properti title wajib sama dengan inputan DTO
    });
  });
});
