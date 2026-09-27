// Function Declaration: Biasanya dipakai untuk fungsi yang sering digunakan. Kelebihannya: bisa dipanggil sebelum dibuat.
function calculateTotal(price, qty) {
  return price * qty;
}

// Function Expression : Biasanya dipakai ketika fungsi disimpan di sebuah variabel.
const calculateTotalExpression = function (price, qty) {
  return price * qty;
};

// Arrow Function
const calculateTax = (amount) => amount * 0.11;

// Scope & Closure
// * -SCOPE : Menentukan di mana sebuah variabel bisa diakses.
function calculateTotalSCP(price, qty) {
  let tax = 0.11;
  console.log(tax);
  return price * qty;
}

// * -Closure: Closure adalah kemampuan sebuah fungsi di dalam untuk mengingat dan mengakses variabel yang ada di lingkungan induknya (Outer Scope), bahkan setelah fungsi induknya selesai dieksekusi.
function createInvoiceCounter() {
  let currentNumber = 0; // Variabel terproteksi di dalam Outer Scope

  return function () {
    currentNumber++; // Fungsi dalam mengingat variabel currentNumber
    return "INV-2026-" + currentNumber;
  };
}

const generateInvoiceId = createInvoiceCounter();

// console.log(generateInvoiceId()); // Output: INV-2026-1
// console.log(generateInvoiceId()); // Output: INV-2026-2

// Callback Function (Fungsi Titipan)
const processPayment = (totalAmount, callback) => {
  console.log("Connecting to payment gateway for amount: Rp " + totalAmount);
  callback();
};

const printReceipt = () => console.log("Payment success! printing receipt....");

processPayment(50000, printReceipt);
