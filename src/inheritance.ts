// src/inheritance.ts

// Parent class
class User {
  constructor(
    public id: number,
    public firstName: string,
    public email: string,
  ) {}

  public getProfileSummary(): string {
    return `[ID # ${this.id}] ${this.firstName} (${this.email})`;
  }
}

// Kelas Anak (Subclass) mewarisi sifat User menggunakan 'extends'
class AdminUser extends User {
  constructor(
    id: number,
    firstName: string,
    email: string,
    public role: string,
  ) {
    // 🔥 WAJIB: Memanggil 'super()' untuk mengirimkan parameter ke constructor kelas induk
    super(id, firstName, email);
  }

  public deleteProduct(): void {
    console.log(
      `Admin ${this.firstName} berhasil menghapus produk dari database POS KASIR`,
    );
  }
}

const admin = new AdminUser(1, "Eno", "eno@gmail.com", "Super admin");
console.log(admin.getProfileSummary()); // ✅ Mewarisi method induk: [ID #1] Eno (eno@dummyjson.com)
admin.deleteProduct(); // ✅ Menjalankan fungsi spesifik kelas anak
