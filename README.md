# ckptw-wabot - WhatsApp Bot dengan @mengkodingan/ckptw

> **Catatan:** Script ini telah diperbarui.

## Gambaran Umum

`ckptw-wabot` adalah bot WhatsApp yang dibangun menggunakan library [@mengkodingan/ckptw](https://ckptw.mengkodingan.my.id/). Bot ini memungkinkan Anda untuk mengotomatisasi berbagai tugas di WhatsApp, serta mendukung arsitektur modular melalui sistem perintah (command).

## Fitur Utama

- **Penanganan Pesan:** Bot dapat menangani pesan yang masuk dan merespons sesuai kebutuhan.
- **Penerjemah Perintah:** Memahami perintah yang dikirim pengguna dan menjalankan tindakan sesuai perintah tersebut.
- **Respon Interaktif:** Bot memberikan tanggapan interaktif dan dinamis terhadap pertanyaan atau perintah pengguna.
- **Penanganan Media:** Mendukung pengiriman dan penerimaan media seperti gambar, video, dan dokumen.
- **Sistem Perintah:** Bot mudah diperluas dengan menambahkan perintah baru yang sesuai dengan kebutuhan Anda.

## Cara Memulai

Ikuti langkah-langkah berikut untuk mengatur dan menjalankan `ckptw-wabot`:

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/itsreimau/ckptw-wabot.git
   cd ckptw-wabot
   ```

2. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi:**
   Ganti nama file `config.example.js` menjadi `config.js`, lalu perbarui nilai konfigurasi seperti nama bot, beberapa pesan, nomor pemilik (Owner), dll.

4. **Menjalankan Bot:**
   ```bash
   npm start
   ```

5. **Autentikasi WhatsApp:**
   Ada dua metode autentikasi yang dapat digunakan untuk menghubungkan bot ke akun WhatsApp Anda:

   - **Menggunakan Kode Pairing:**
     - Setelah bot dijalankan, kode pairing akan ditampilkan di terminal.
     - Buka aplikasi WhatsApp di ponsel, pilih menu **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**.
     - Masukkan kode pairing yang ditampilkan untuk menautkan akun WhatsApp dengan bot.

   - **Menggunakan Kode QR:**
     - Setelah bot dijalankan, kode QR akan muncul di terminal.
     - Buka aplikasi WhatsApp di ponsel, pilih menu **Perangkat Tertaut**, lalu ketuk **Tautkan Perangkat**.
     - Pindai kode QR yang muncul untuk menautkan akun WhatsApp dengan bot.

6. **Mulai Berinteraksi:**
   Setelah proses autentikasi berhasil, bot siap menerima dan merespon pesan sesuai perintah yang dikirimkan.

## Kustomisasi

### Menambahkan Perintah Baru

Untuk menambahkan perintah baru, ikuti langkah-langkah berikut:

1. Buat file JavaScript baru di folder `commands` dengan fungsionalitas yang diinginkan, misalnya `test-helloworld.js`:

   ```javascript
   // commands/test/helloworld.js

   module.exports = {
       name: "helloworld", // Nama perintah.
       category: "test", // Kategori perintah.
       code: async (ctx) => { // Fungsi yang akan dijalankan ketika perintah ini dieksekusi.
           // Memanggil fungsi global.handler dengan objek ctx dan konfigurasi sebagai parameter.
           const {
               status, // Status hasil eksekusi fungsi handler.
               message // Pesan yang akan dikirim jika status true.
           } = await global.handler(ctx, {
               admin: Boolean, // Opsi admin (true atau false)
               botAdmin: Boolean, // Opsi bot admin (true atau false).
               banned: Boolean, // Opsi banned (true atau false).
               coin: Array || Number, // Opsi koin (Array atau Number).
               cooldown: Number, // Opsi cooldown (Number).
               group: Boolean, // Opsi grup (true atau false).
               owner: Boolean, // Opsi owner (true atau false).
               premium: Boolean, // Opsi premium (true atau false).
               private: Boolean // Opsi private (true atau false).
           });
           if (status) return ctx.reply(message); // Jika status true, maka kirim pesan.

           return ctx.reply("Hello, World!"); // Jika status false, maka kirim pesan "Hello, World!".
       }
   };
   ```

2. Perintah baru ini bisa dipicu dengan mengirimkan `/helloworld` di chat.

### [Baca Dokumentasi @mengkodingan/ckptw](https://ckptw.mengkodingan.my.id/)

Untuk informasi lebih lanjut tentang penggunaan library ini, kunjungi [dokumentasi ckptw](https://ckptw.mengkodingan.my.id/).

## Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda menemukan bug atau memiliki ide untuk fitur baru, jangan ragu untuk membuka issue atau mengirimkan pull request.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

---

Jelajahi, modifikasi, dan tingkatkan `ckptw-wabot` sesuai kebutuhan Anda. Selamat mencoba dan semoga sukses!