// src/index.ts

class Product {
  // 1. PROPERTI (Variabel/data yang melekat pada objek)
  title: string;
  price: number;
  stock: number;
  color: string;

  // 2. CONSTRUCTOR (Gerbang awal inisialisasi data)
  constructor(title: string, price: number, stock: number, color: string) {
    // 'this' bertugas memasukkan data kiriman parameter ke properti internal objek
    this.title = title;
    this.price = price;
    this.stock = stock;
    this.color = color;
  }
  // 3. METHOD (Fungsi internal objek, ditulis TANPA kata kunci 'function')
  displayInfo(): string {
    return `${this.title} - Rp${this.price} (Stok: ${this.stock}) & color : ${this.color}`;
  }

  addStock(amount: number): void {
    this.stock += amount;
  }
  decreaseStock(amount: number): void {
    this.stock -= amount;
  }
}

class SecureProduct {
  public title: string;
  private price: number; // 🔒 Dikunci total dari dunia luar
  protected category: string; // 🔑 Hanya bisa diakses kelas ini dan kelas turunannya

  constructor(title: string, price: number, category: string) {
    this.title = title;
    this.price = price;
    this.category = category;
  }
  // Karena price bersifat private, kita sediakan method resmi untuk mengubahnya dengan validasi
  public changePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error("Harga tidak boleh minus, ini merugikan toko!");
    } else {
      this.price = newPrice;
    }
  }

  public getPrice(): number {
    return this.price;
  }

  public getCategory(): string {
    return this.category;
  }
}

const newProduct = new SecureProduct("Sepatu nike", 25000, "Fashion culture");
newProduct.changePrice(1000000);
console.log(
  `Product ${newProduct.title}, harganya : ${newProduct.getPrice()}, kategorinya : ${newProduct.getCategory()}`,
);

// // Cara Penggunaan (Instansiasi Objek)
// // Data di bawah ini akan ditangkap langsung oleh Constructor di atas
// const product = new Product("Kulkas Sharp", 3000000, 5, "Gray");
// console.log(product.displayInfo()); // Output: Kulkas Sharp - Rp3000000 (Stok: 5) & color Gray
// product.addStock(10);
// console.log(
//   `Penambahan stock product: ${product.title}, sebesar : ${product.stock}`,
// );
// product.decreaseStock(10);
// console.log(
//   `Pengurangan stock product: ${product.title}, sebesar : ${product.stock}`,
// );
