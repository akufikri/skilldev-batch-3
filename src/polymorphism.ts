// src/polymorphism.ts

// Parent class (class induk/utama)
export class BaseCart {
  constructor(
    public id: number,
    public total: number,
  ) {}

  public calculateFinalPayment(): number {
    return this.total;
  }
}

// Childern class 1
export class PromoCart extends BaseCart {
  constructor(
    id: number,
    total: number,
    private discountPercentage: number,
  ) {
    super(id, total);
  }
  // 🔄 METHOD OVERRIDING: Menimpa fungsi induk untuk menyuntikkan rumus diskon promo
  public override calculateFinalPayment(): number {
    const discountAmount = this.total * (this.discountPercentage / 100);
    return this.total - discountAmount;
  }
}

// Childern class 2
export class TaxedCart extends BaseCart {
  // 🔄 METHOD OVERRIDING: Menimpa fungsi induk untuk menyuntikkan kalkulasi pajak 11%
  public override calculateFinalPayment(): number {
    const taxAmount = this.total * 0.11;
    return this.total + taxAmount;
  }
}
// 🧪 Pengujian Polimorfisme: Satu blueprint induk, menghasilkan output berbeda sesuai wujudnya
// const carts: BaseCart[] = [
//   new BaseCart(101, 100),
//   new PromoCart(102, 100, 15), // Diskon 15%
//   new TaxedCart(103, 100), // Pajak 11%
// ];
// carts.forEach((cart) => {
//   console.log(
//     `Cart ID #${cart.id} - Total tagihan akhir: $${cart.calculateFinalPayment()}`,
//   );
// });
