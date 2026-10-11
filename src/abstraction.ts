// src/abstraction.ts

// 🅰️ INSTRUMEN 1: INTERFACE
// Memaksa seluruh repositori backend untuk wajib memiliki fungsi fetchById
interface IRepository {
  fetchById(id: number): Promise<void>;
}

// 🅰️ INSTRUMEN 1: INTERFACE
// Memaksa seluruh repositori backend untuk wajib memiliki fungsi fetchById
abstract class BaseService {
  // A. Regular Method: Sudah matang, otomatis diwarisi langsung oleh semua kelas anak
  public logActivity(message: string): void {
    console.log(
      `[LOG SYSTEM - ${new Date().toLocaleDateString()}]: ${message}`,
    );
  }

  // B. Abstract Method: Masih kosong, wajib dirakit isinya secara manual oleh kelas anak
  abstract executeProcess(id: number): Promise<void>;
}
// 🎛️ IMPLEMENTASI NYATA PADA KELAS SERVICES ANAK
// Kelas ini mewarisi BaseService (extends) SEKALIKUS mematuhi kontrak IRepository (implements)

class ProductService extends BaseService implements IRepository {
  // 1. Memenuhi kewajiban kontrak dari interface IRepository
  public async fetchById(id: number): Promise<void> {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();
    console.log(`[DATA API]: ${data.title} - $${data.price}`);
  }
  // 2. Memenuhi kewajiban wajib rakit fungsi milik abstract class BaseService
  public async executeProcess(id: number): Promise<void> {
    // Kita bisa langsung memanggil logActivity karena otomatis diwarisi dari BaseService
    this.logActivity(`Memicu transaksi pencarian untuk ID Produk #${id}`);

    console.log(`Menjalankan validasi internal database...`);
    await this.fetchById(id);
  }
}

async function run() {
  // const serviceErr = new BaseService(); ❌ EROR! Cannot create an instance of an abstract class.

  const productService = new ProductService(); // ✅ Sah, karena class anak sudah matang
  await productService.executeProcess(1);
}

run();
