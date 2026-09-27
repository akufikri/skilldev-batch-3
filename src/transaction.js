// ==========================================
// 1. CLOSURE PATTERN: Invoice Generator
// ==========================================

const initInvoiceSystem = () => {
  let invoiceCounter = 100;

  return () => {
    invoiceCounter++;
    return `INV-2026-${invoiceCounter}`;
  };
};
const getNewInvoiceNumber = initInvoiceSystem();

// ==========================================
// 2. ARROW FUNCTION: Perhitungan Pajak
// ==========================================
const calculateTax = (subtotal) => subtotal * 0.11; // PPN 11%

// ==========================================
// 3. FUNCTION EXPRESSION: Hitung Total Belanja
// ==========================================
const calculateGrandTotal = function (itemsArray) {
  let subtotal = 0;

  // Menyisir total item
  itemsArray.forEach((item) => {
    subtotal += item.price * item.qty;
  });

  const tax = calculateTax(subtotal);
  return {
    subtotal: subtotal,
    tax: tax,
    grandTotal: subtotal + tax,
  };
};

// ==========================================
// 4. CALLBACK PATTERN: Penyelesaian Transaksi
// ==========================================
const checkoutTransaction = (cartItems, paymentMethod, onPaymentSuccess) => {
  console.log("\n==================================");
  console.log("       STARTING CHECKOUT          ");
  console.log("==================================");

  const invoiceId = getNewInvoiceNumber();
  const billDetails = calculateGrandTotal(cartItems);

  console.log(`Invoice ID : ${invoiceId}`);
  console.log(`Subtotal   : Rp ${billDetails.subtotal}`);
  console.log(`PPN (11%)  : Rp ${billDetails.tax}`);
  console.log(`Total Bill : Rp ${billDetails.grandTotal}`);
  console.log(`Method     : ${paymentMethod}`);
  console.log("----------------------------------");
  console.log("Processing payment, please wait...");

  onPaymentSuccess(invoiceId);
};

// ==========================================
// 5. JALAN KASIR (EKSEKUSI DATA NYATA)
// ==========================================
// Data Keranjang Belanja Sementara di Layar Kasir
const activeCart = [
  { name: "Ice palm sugar latte", price: 25000, qty: 2 },
  { name: "Butter croisant", price: 18000, qty: 1 },
];
// Menyiapkan fungsi Callback untuk aksi sukses
const handlePrintReceipt = (id) => {
  console.log(
    `Success! [CALLBACK EXECUTED]: Receipt for ${id} has been printed.`,
  );
};

// Kasir menekan tombol bayar pakai QRIS
checkoutTransaction(activeCart, "QRIS", handlePrintReceipt);

// Transaksi Kedua untuk Pelanggan berikutnya
const nextCart = [{ name: "Expresso short", price: 15000, qty: 1 }];

checkoutTransaction(activeCart, "DEBIT", handlePrintReceipt);
