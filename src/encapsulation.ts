// src/encapsulation.ts
export class DummyProduct {
  // Properti dikunci rapat menggunakan hak akses private dan konvensi underscore (_)
  constructor(
    private _title: string,
    private _price: number,
    private _stock: number,
  ) {}
  // 1. GETTER: Bertindak sebagai fungsi tapi diakses eksternal seperti properti biasa

  get title(): string {
    return this._title;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  // 2. SETTER: Menyaring data masuk menggunakan validasi ketat sebelum mengubah memori
  set price(newPrice: number) {
    if (newPrice < 0) {
      console.log("Error: price cannot be negative/minus!");
      return;
    }
    this._price = newPrice;
  }
  set stock(newStock: number) {
    if (newStock < 0) {
      console.log("Error: stock not valid!");
      return;
    }
    this._stock = newStock;
  }
}
// const product = new DummyProduct("Iphone 18 pro max", 19999, 50);
// product.price = 599;

// console.log(
//   `Produk: ${product.title} ${product.stock} unit tersedia dengan harga $${product.price}`,
// );
