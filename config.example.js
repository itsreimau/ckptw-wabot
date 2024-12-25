// Modul dan dependensi yang diperlukan
const pkg = require("./package.json");
const {
    monospace,
    italic,
    quote
} = require("@mengkodingan/ckptw");

// Konfigurasi
global.config = {
    // Informasi bot dasar
    bot: {
        name: "CKPTW", // Nama bot
        prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i, // Karakter awalan perintah yang diizinkan
        phoneNumber: "", // Nomor telepon bot (opsional jika menggunakan QR code)
        thumbnail: "", // Gambar thumbnail bot
        website: "https://chat.whatsapp.com/FxEYZl2UyzAEI2yhaH34Ye", // Website untuk WhatsApp bot
        groupJid: "" // JID untuk group bot (opsional jika tidak menggunakan requireBotGroupMembership)
    },

    // Pesan bot yang disesuaikan untuk situasi tertentu
    msg: {
        admin: quote("⛔ Perintah hanya dapat diakses oleh admin grup!"), // Pesan ketika perintah hanya untuk admin
        banned: quote("⛔ Tidak dapat memproses karena Anda telah dibanned oleh Owner!"), // Pesan untuk pengguna yang dibanned
        botAdmin: quote("⛔ Tidak dapat memproses karena bot bukan admin grup ini!"), // Pesan jika bot bukan admin di grup
        botGroupMembership: quote("⛔ Tidak dapat memproses karena Anda tidak bergabung dengan grup bot!"), // Pesan untuk pengguna yang tidak ada dalam grup
        cooldown: quote("🔄 Perintah ini sedang dalam cooldown, tunggu..."), // Pesan saat cooldown perintah
        coin: quote("⛔ Tidak dapat memproses karena koin Anda tidak cukup!"), // Pesan ketika koin tidak cukup
        group: quote("⛔ Perintah hanya dapat diakses dalam grup!"), // Pesan untuk perintah grup
        owner: quote("⛔ Perintah hanya dapat diakses Owner!"), // Pesan untuk perintah yang hanya owner bisa akses
        premium: quote("⛔ Tidak dapat memproses karena Anda bukan pengguna Premium!"), // Pesan jika pengguna bukan Premium
        private: quote("⛔ Perintah hanya dapat diakses dalam obrolan pribadi!"), // Pesan untuk perintah obrolan pribadi
        restrict: quote("⛔ Perintah ini telah dibatasi karena alasan keamanan!"), // Pesan pembatasan perintah

        watermark: `@${pkg.name} / v${pkg.version}`, // Watermark nama dan versi pada bot
        footer: italic("Developed by ItsReimau"), // Footer di pesan bot
        readmore: "\u200E".repeat(4001), // String read more

        wait: quote("🔄 Tunggu sebentar..."), // Pesan loading
        notFound: quote("❎ Tidak ada yang ditemukan! Coba lagi nanti."), // Pesan item tidak ditemukan
        urlInvalid: quote("❎ URL tidak valid!") // Pesan jika URL tidak valid
    },

    // Informasi owner bot
    owner: {
        name: "", // Nama owner bot
        number: "", // Nomor telepon owner bot
        organization: "", // Nama organisasi owner bot
        co: [""] // Nomor co-owner bot
    },

    // Konfigurasi stiker bot
    sticker: {
        packname: "", // Nama paket stiker
        author: "github.com/itsreimau/ckptw-wabot" // Pembuat stiker
    },

    system: {
        alwaysOnline: true, // Bot selalu aktif
        autoMention: false, // Bot otomatis mention seseorang dalam pesan yang dikirim
        autoRead: true, // Bot baca pesan otomatis
        autoTypingOnCmd: true, // Tampilkan status mengetik saat memproses
        cooldown: 5000, // Jeda antar perintah (ms)
        port: 8080, // Port (jika pakai server)
        restrict: false, // Batasi akses perintah
        requireBotGroupMembership: false, // Harus gabung grup bot
        selfOwner: false, // Bot jadi owner sendiri
        selfReply: true, // Bot balas pesan bot sendiri
        timeZone: "Asia/Jakarta", // Zona waktu bot
        useCoin: true, // Pakai koin
        usePairingCode: false, // Pakai kode pairing untuk koneksi
        useServer: false // Jalankan bot tanpa server
    }
};