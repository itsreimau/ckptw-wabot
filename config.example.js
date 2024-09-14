const pkg = require("./package.json");
const {
    monospace,
    italic,
    quote
} = require("@mengkodingan/ckptw");

// Bot.
global.bot = {
    name: "CKPTW",
    prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
    phoneNumber: "628xxxxxxxxxx", // Abaikan jika Anda menggunakan kode QR untuk otentikasi.
    thumbnail: "https://e1.pxfuel.com/desktop-wallpaper/943/672/desktop-wallpaper-whatsapp-bot-what-is-it-and-how-to-use-messenger-chatbots-chatbot.jpg",
    groupChat: "https://chat.whatsapp.com/FlqTGm4chSjKMsijcqAIJs" // Jangan lupa untuk bergabung ya teman-teman!
};

// MSG (Pesan).
global.msg = {
    // Akses perintah.
    admin: quote("⚠ Perintah hanya dapat diakses oleh admin grup!"),
    banned: quote("⚠ Tidak dapat memproses karena Anda telah dibanned!"),
    botAdmin: quote("⚠ Bot bukan admin, tidak bisa menggunakan perintah!"),
    cooldown: quote("⚠ Perintah ini sedang dalam cooldown, tunggu..."),
    energy: quote(`⚠ Anda tidak punya cukup energi! Ketik ${monospace("/charger")} untuk mengisi energi.`),
    group: quote("⚠ Perintah hanya dapat diakses dalam grup!"),
    onCharger: quote("Karena sedang mengisi daya, perintah ini tidak dapat digunakan. Tunggu sampai energinya penuh."),
    owner: quote("⚠ Perintah hanya dapat diakses Owner!"),
    premium: quote("⚠ Anda bukan pengguna Premium!"),
    private: quote("⚠ Perintah hanya dapat diakses dalam obrolan pribadi!"),

    // Antarmuka perintah.
    watermark: `${pkg.name}@^${pkg.version}`,
    footer: italic("Developed by ItsReimau"),
    readmore: "\u200E".repeat(4001),

    // Proses perintah.
    wait: "🔄 Tunggu sebentar...",
    notFound: "❎ Tidak ada yang ditemukan!",
    urlInvalid: "❎ URL tidak valid!"
};

// Owner & CoOwner.
global.owner = {
    name: "John Doe",
    number: "628xxxxxxxxxx",
    organization: "jdoe.org",
    co: ["628xxxxxxxxxx"]
};

// Stiker.
global.sticker = {
    packname: "Stiker ini dibuat oleh",
    author: "@ckptw-wabot"
};

// Sistem.
global.system = {
    autoRead: true,
    cooldown: 10000,
    selfReply: true,
    timeZone: "Asia/Jakarta",
    useInteractiveMessage: true,
    usePairingCode: true
};