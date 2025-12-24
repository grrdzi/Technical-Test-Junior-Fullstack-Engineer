Technical Test: Junior Fullstack Engineer
Topic: Simple Procurement System (Sistem Pengadaan Barang)

Inventory & Purchasing Management System 📦
Berikut adalah tugas technical test : Junior Fullstack Engineer, yaitu sistem informasi manajemen stok dan pengadaan barang (purchasing) berbasis web. 
Aplikasi ini mengimplementasikan Role-Based Access Control (RBAC), integrasi Webhook, dan manajemen inventaris secara real-time.s
🚀 Alur Penggunaan Aplikasi (User Journey)
1. Autentikasi & Sesi
   - Halaman Utama (index.html): Pengguna disambut dengan form Login dan Registrasi.
   - Registrasi: Pengguna baru diwajibkan mendaftarkan username, password, dan memilih role (Admin atau Staff).
   - Login: Setelah masuk, token keamanan (JWT) akan disimpan di sessionStorage (Sesi akan hilang jika tab browser ditutup).

2. Dashboard & Manajemen Data (RBAC)
   - Tampilan Dashboard: Menampilkan tabel item yang diambil dari database melalui API.
   - Akses Staff: Hanya dapat melihat daftar item dan mengakses halaman Create Purchase.
   - Akses Admin:
     1) Memiliki akses penuh terhadap navigasi Manage Suppliers dan Manage Items.
     2) Tombol +Add Item di dashboard akan mengarahkan Admin ke halaman pengelolaan untuk menambah, mengubah, atau menghapus data item.
     3) Dapat mengelola data Supplier (Tambah, Update, Hapus).

3. Sistem Pembelian (Purchasing Workflow)
   - Halaman navigasi Purchase memungkinkan user untuk melakukan pemesanan barang dengan alur:
   - Input Data: Memilih Supplier dan Item yang terdaftar (harga & stok diambil otomatis dari database).
   - Temporary Cart (Tabel Sementara): List order yang dipilih masuk ke keranjang sementara di sisi klien. User dapat membatalkan item tertentu sebelum finalisasi.
   - Submit Purchase:
     1) Data dipush secara atomik ke tabel purchasings dan purchasing_details.
     2) Update Stok Otomatis: Stok barang di tabel items langsung terpotong sesuai jumlah order.
     3) Kalkulasi: Sistem otomatis menghitung Sub Total dan Grand Total pembelian.
     4) Webhook Integration: Data transaksi dikirim secara asinkron dalam format JSON ke URL dummy (Webhook.site) untuk keperluan monitoring eksternal.

🛠️ Teknologi yang Digunakan
1. Backend: Go (Fiber Framework)
2. Database: MySQL dengan GORM (ORM)
3. Frontend: HTML5, CSS3 (Bootstrap), JavaScript (jQuery)
4. Security: JWT (JSON Web Token) dengan sessionStorage
5. Notification: SweetAlert2 untuk feedback user

⚙️ Instruksi Instalasi & Menjalankan Aplikasi
1. Persiapan Database
   - Buat database MySQL bernama inventory_db.
   - Sesuaikan kredensial database pada file config/database.go.

2. Menjalankan Backend
   - Buka terminal pada direktori root proyek:
     
     Bash

     # Mengunduh dependensi
     go mod tidy

     # Menjalankan server
     go run main.go
     
     Server akan berjalan di http://localhost:3000.

3. Mengakses Aplikasi
   - Buka browser dan akses http://localhost:3000/index.html.
   - Daftar akun baru melalui form registrasi.
   - Login untuk masuk ke Dashboard.

📂 Struktur Database Utama
1. users: Menyimpan data kredensial dan role.
2. items: Menyimpan data stok dan harga barang.
3. suppliers: Menyimpan informasi vendor.
4. purchasings: Menyimpan header transaksi pembelian.
5. purchasing_details: Menyimpan detail item dalam satu transaksi.
