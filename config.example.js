const pkg = require("./package.json");
const {
    italic
} = require("@mengkodingan/ckptw");

// Bot.
global.bot = {
    name: "CKPTW",
    prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
    phoneNumber: "628xxxxxxxxxx", // Ignore if you use QR code for authentication.
    thumbnail: "https://e1.pxfuel.com/desktop-wallpaper/943/672/desktop-wallpaper-whatsapp-bot-what-is-it-and-how-to-use-messenger-chatbots-chatbot.jpg",
    groupChat: "https://chat.whatsapp.com/FlqTGm4chSjKMsijcqAIJs" // Don't forget to join, friends!
};

// MSG (Message).
global.msg = {
    // Command access.
    admin: "Perintah hanya dapat diakses oleh admin grup!",
    banned: "Tidak dapat memproses karena Anda telah dibanned!",
    botAdmin: "Bot bukan admin, tidak bisa menggunakan perintah!",
    coin: "Anda tidak punya cukup koin!",
    group: "Perintah hanya dapat diakses dalam grup!",
    owner: "Perintah hanya dapat diakses Owner!",
    premium: "Anda bukan pengguna Premium!",
    private: "Perintah hanya dapat diakses dalam obrolan pribadi!",

    // Command interface.
    watermark: `${pkg.name}@^${pkg.version}`,
    footer: italic("Developed by ItsReimau"),
    readmore: "\u200E".repeat(4001),

    // Command process.
    argument: "Masukkan argumen!",
    wait: "Tunggu sebentar...",

    // Command process (Error).
    notFound: "Tidak ada yang ditemukan!",
    urlInvalid: "URL tidak valid!"
};

// Owner & CoOwner.
global.owner = {
    name: "John Doe",
    number: "628xxxxxxxxxx",
    organization: "jdoe.org",
    co: ["628xxxxxxxxxx"]
};

// Sticker.
global.sticker = {
    packname: "Stiker ini dibuat oleh",
    author: "@ckptw-wabot"
};

// System.
global.system = {
    autoRead: true,
    selfReply: true,
    timeZone: "Asia/Jakarta",
    useCoin: true,
    useInteractiveMessage: true,
    usePairingCode: true,
    usePremium: false
};