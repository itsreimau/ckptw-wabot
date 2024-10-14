# ckptw-wabot - WhatsApp Bot dengan @mengkodingan/ckptw

> **Catatan:** Script ini telah diperbarui dengan berbagai fitur modern.

## Gambaran Umum

`ckptw-wabot` adalah solusi bot WhatsApp yang dibangun menggunakan [@mengkodingan/ckptw](https://ckptw.mengkodingan.my.id/). Dengan dukungan arsitektur modular, bot ini mampu mengotomatisasi berbagai tugas di WhatsApp sekaligus memungkinkan ekspansi melalui sistem perintah (command).

## Fitur Utama

- **Penanganan Pesan Cerdas:** Bot merespons pesan sesuai dengan perintah yang diberikan.
- **Respon Dinamis & Interaktif:** Tanggapan yang diberikan sangat fleksibel, cocok untuk berbagai kebutuhan.
- **Penanganan Media:** Mendukung pengiriman dan penerimaan media seperti gambar, video, dan dokumen.
- **Sistem Perintah Fleksibel:** Bot mudah diperluas dan dimodifikasi sesuai kebutuhan Anda.

## Cara Memulai

Untuk memulai menggunakan `ckptw-wabot`, ikuti langkah-langkah di bawah ini:

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
   Ganti nama file `config.example.js` menjadi `config.js`, dan sesuaikan konfigurasi seperti nama bot, pesan khusus, nomor pemilik, dan lain-lain.

4. **Menjalankan Bot:**
   ```bash
   npm start
   ```

5. **Autentikasi WhatsApp:**
   Ada dua metode autentikasi yang dapat Anda pilih:

   - **Menggunakan Kode Pairing:**
     - Setelah bot dijalankan, kode pairing akan muncul di terminal.
     - Tautkan perangkat WhatsApp Anda dengan memasukkan kode pairing yang ditampilkan.

   - **Menggunakan Kode QR:**
     - Pindai kode QR di aplikasi WhatsApp untuk menautkan perangkat.

6. **Interaksi:**
   Setelah proses autentikasi berhasil, bot siap menerima dan merespons pesan sesuai perintah.

## Kustomisasi

### Menambahkan Perintah Baru

Untuk menambah perintah baru, ikuti langkah-langkah ini:

1. Buat file JavaScript baru di dalam folder `commands` dengan fungsionalitas yang diinginkan. Contoh perintah sederhana:

   ```javascript
   // commands/test/helloworld.js
   module.exports = {
       name: "helloworld",
       category: "test",
       handler: {
           admin: false,
           botAdmin: false,
           banned: false,
           coin: 0,
           cooldown: 0,
           group: false,
           owner: false,
           premium: false,
           private: false
       },
       code: async (ctx) => {
           return ctx.reply("Hello, World!");
       }
   };
   ```

2. Setelah perintah baru ditambahkan, Anda dapat memanggilnya dengan mengirimkan `/helloworld` di chat.

### [Baca Dokumentasi @mengkodingan/ckptw](https://ckptw.mengkodingan.my.id/)

Untuk detail lebih lanjut tentang penggunaan library ini, kunjungi [dokumentasi resmi](https://ckptw.mengkodingan.my.id/).

## Kontribusi

<a href="https://github.com/itsreimau"><img src="https://avatars.githubusercontent.com/u/90613431?v=4" width="100" height="100"></a> | <a href="https://github.com/JastinXyz"><img src="https://avatars.githubusercontent.com/u/73673322?v=4" width="100" height="100"></a> | <a href="https://github.com/WhiskeySockets"><img src="https://avatars.githubusercontent.com/u/131354555?s=200&v=4" width="100" height="100"></a> | <a href="https://github.com/aidulcandra"><img src="https://avatars.githubusercontent.com/u/84653497?v=4" width="100" height="100"></a> | <a href="https://github.com/NyxAltair"><img src="https://avatars.githubusercontent.com/u/170422885?v=4" width="100" height="100"></a>
----|----|----|----|----
[ItsReimau](https://github.com/itsreimau) | [JastinXyz](https://github.com/JastinXyz) | [WhiskeySockets](https://github.com/WhiskeySockets) | [Aidul Candra](https://github.com/aidulcandra) | [Nyx Altair](https://github.com/NyxAltair)
Pendiri & Pengembang Utama | Pencipta @mengkodingan/ckptw | Pencipta @whiskeysockets/baileys | Penolong Saat Error | Penyedia Sumber Daya

Kami menyambut semua bentuk kontribusi! Jika Anda menemukan bug atau memiliki ide fitur baru, jangan ragu untuk membuka issue atau mengirimkan pull request. 

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

---

**`ckptw-wabot`**: Eksplorasi, modifikasi, dan kembangkan bot WhatsApp yang cerdas dan mudah digunakan ini sesuai kebutuhan Anda. Selamat mencoba dan terus berkreasi!