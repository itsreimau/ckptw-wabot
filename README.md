# ckptw-wabot - WhatsApp Bot dengan @mengkodingan/ckptw

> **Catatan:** Skrip hanya diperbarui jika diperlukan, seperti untuk penyesuaian atau perbaikan.

## Deskripsi

`ckptw-wabot` adalah bot WhatsApp yang dibangun menggunakan library [@mengkodingan/ckptw](https://ckptw.mengkodingan.my.id/). Bot ini memungkinkan Anda untuk mengotomatisasi berbagai tugas di WhatsApp dan mendukung arsitektur modular melalui sistem perintah (command).

## Fitur Utama

- **Penanganan Pesan:** Bot dapat menangani pesan yang masuk dan memberikan respons sesuai kebutuhan.
- **Penanganan Perintah:** Bot dapat menangani perintah yang dikirim oleh pengguna dan menjalankan tindakan yang sesuai.
- **Respon Interaktif:** Bot memberikan tanggapan dinamis dan interaktif terhadap pertanyaan atau perintah pengguna.
- **Penanganan Media:** Mendukung pengiriman dan penerimaan berbagai media seperti gambar, video, dan dokumen.
- **Sistem Perintah Modular:** Bot mudah diperluas dengan menambahkan perintah baru sesuai kebutuhan Anda.

## Cara Memulai

Ikuti langkah-langkah berikut untuk mengatur dan menjalankan `ckptw-wabot`:

### 1. Kloning Repositori

Pertama, kloning repositori dan masuk ke direktori proyek:

```bash
git clone https://github.com/itsreimau/ckptw-wabot.git
cd ckptw-wabot
```

### 2. Instalasi Dependensi

Instal semua dependensi yang dibutuhkan dengan perintah berikut:

```bash
npm install
```

### 3. Konfigurasi

Ganti nama file `config.example.js` menjadi `config.js`, lalu sesuaikan konfigurasi seperti nama bot, pesan default, nomor pemilik bot, dan lain-lain.

## Adapter Penyimpanan

`ckptw-wabot` mendukung penyimpanan sesi autentikasi menggunakan pilihan database: **MySQL**, **MongoDB**, dan **Firebase**. Pilih dan atur database sesuai preferensi Anda dengan langkah-langkah berikut:

### 1. Pilih Adapter Database

Pada file konfigurasi `config.js`, sesuaikan bagian `authAdapter` dengan adapter database yang Anda pilih. Berikut adalah contoh konfigurasi untuk masing-masing database:

#### MySQL

```javascript
authAdapter: {
    adapter: "mysql", // Pilihan adapter: 'default', 'mysql', 'mongo', 'firebase'

    // Konfigurasi MySQL
    mysql: {
        host: "localhost:3306", // Nama host 
        user: "root", // Nama pengguna 
        password: "admin123", // Kata sandi
        database: "ckptw-wabot" // Nama database 
    }
}
```

#### MongoDB

```javascript
authAdapter: {
    adapter: "mongodb", // Pilihan adapter: 'default', 'mysql', 'mongo', 'firebase'

    // Konfigurasi MongoDB
    mongodb: {
        url: "mongodb://localhost:27017/ckptw-wabot" // URL
    }
}
```

#### Firebase

```javascript
authAdapter: {
    adapter: "firebase", // Pilihan adapter: 'default', 'mysql', 'mongo', 'firebase'

    // Konfigurasi Firebase
    firebase: {
        tableName: "ckptw-wabot", // Nama tabel
        session: "state" // Nama sesi
    }
}
```

### 2. Instal Modul Database

Setelah memilih adapter yang diinginkan, jalankan perintah berikut untuk menginstal modul yang diperlukan:

```bash
npm run install:adapter
```

Perintah ini akan menginstal modul yang sesuai dengan konfigurasi adapter yang Anda pilih.

### 3. Pastikan Database Aktif

Pastikan server database Anda aktif dan dapat diakses sebelum menjalankan bot. Periksa hal-hal berikut:

- Untuk **MySQL**, pastikan kredensial pengguna dan nama database benar.
- Untuk **MongoDB**, pastikan URL yang dimasukkan dapat terhubung ke server MongoDB Anda.
- Untuk **Firebase**, pastikan kredensial akun layanan yang diunduh dari Google Firebase Console telah dimasukkan dengan benar.

## Menjalankan Bot

Setelah konfigurasi selesai, Anda dapat menjalankan bot dengan dua opsi berikut:

### 1. Jalankan Secara Langsung

Untuk menjalankan bot secara langsung di terminal, gunakan perintah:

```bash
npm start
```

Bot akan berjalan hingga Anda menutup terminal atau menghentikannya secara manual.

### 2. Jalankan dengan PM2

Jika Anda ingin menjalankan bot sebagai layanan latar belakang (background process) yang tetap aktif meskipun terminal ditutup, gunakan PM2:

```bash
npm run start:pm2
```

## Autentikasi WhatsApp

Ada dua metode autentikasi yang dapat digunakan untuk menghubungkan bot ke akun WhatsApp Anda:

### 1. Menggunakan Kode Pairing

- Setelah bot dijalankan, kode pairing akan ditampilkan di terminal.
- Buka aplikasi WhatsApp di ponsel, pilih menu **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**.
- Masukkan kode pairing yang ditampilkan di terminal untuk menautkan akun WhatsApp dengan bot.

### 2. Menggunakan Kode QR

- Setelah bot dijalankan, kode QR akan muncul di terminal.
- Buka aplikasi WhatsApp di ponsel, pilih menu **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**.
- Pindai kode QR yang muncul di terminal untuk menautkan akun WhatsApp dengan bot.

Setelah proses autentikasi berhasil, bot siap untuk menerima dan merespons pesan sesuai dengan perintah yang diberikan.

## Kustomisasi

### Menambahkan Perintah Baru

Untuk menambahkan perintah baru, ikuti langkah-langkah berikut:

1. Buat file JavaScript baru di folder `commands` dengan fungsionalitas yang diinginkan. Misalnya, buat file `test/helloworld.js`:

   ```javascript
   // commands/test/helloworld.js

   module.exports = { // Mengatur dan membagikan fungsi untuk perintah "helloworld"
       name: "helloworld", // Nama perintah yang akan digunakan oleh pengguna
       category: "test", // Kategori untuk mengelompokkan perintah ini
       permissions: { // Pengaturan khusus untuk perintah ini
           admin: Boolean, // Apakah hanya admin grup yang bisa menggunakan perintah ini? (true/false)
           botAdmin: Boolean, // Apakah bot harus menjadi admin agar bisa menjalankan perintah ini? (true/false)
           coin: Number, // Jumlah koin yang diperlukan untuk menjalankan perintah ini
           group: Boolean, // Apakah perintah ini hanya bisa digunakan di dalam grup? (true/false)
           owner: Boolean, // Apakah hanya pemilik bot yang bisa menggunakan perintah ini? (true/false)
           premium: Boolean, // Apakah hanya pengguna premium yang bisa menggunakan perintah ini? (true/false)
           private: Boolean // Apakah perintah ini hanya bisa digunakan dalam chat pribadi? (true/false)
       },
       code: async (ctx) => { // Fungsi yang dijalankan saat perintah ini dipanggil
           return await ctx.reply("Hello, World!"); // Kirim pesan "Hello, World!" kepada pengguna
       }
   };
   ```

2. Perintah ini dapat dipicu dengan mengirimkan `/helloworld` di chat.

### Dokumentasi Lengkap

Untuk informasi lebih lanjut mengenai penggunaan library `@mengkodingan/ckptw`, kunjungi [dokumentasi ckptw](https://ckptw.mengkodingan.my.id/).

## Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda menemukan bug atau memiliki ide untuk fitur baru, jangan ragu untuk membuka issue atau mengirimkan pull request.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).