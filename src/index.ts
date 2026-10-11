import { DummyProduct } from "./encapsulation.js";
import { BaseCart, PromoCart, TaxedCart } from "./polymorphism.js";

// Encapsulation Testing
// const product = new DummyProduct("Iphone 18 pro max", 19999, 50);
// product.price = 599;

// console.log(
//   `Produk: ${product.title} ${product.stock} unit tersedia dengan harga $${product.price}`,
// );

// 🧪 Pengujian Polimorfisme: Satu blueprint induk, menghasilkan output berbeda sesuai wujudnya
const carts: BaseCart[] = [
  new BaseCart(101, 100),
  new PromoCart(102, 100, 15), // Diskon 15%
  new TaxedCart(103, 100), // Pajak 11%
];
carts.forEach((cart) => {
  console.log(
    `Cart ID #${cart.id} - Total tagihan akhir: $${cart.calculateFinalPayment()}`,
  );
});
