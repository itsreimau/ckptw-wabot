const package = require("./package.json");
const {
    bold,
    quote
} = require("@mengkodingan/ckptw");

// API Key.
global.apiKey = {
    lowline: "REPLACE_THIS_WITH_YOUR_API_KEY" // Get it at: https://chat.openai.com/ (Optional)
};

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
    admin: `${bold("[ ! ]")} Perintah hanya dapat diakses oleh admin grup!`,
    banned: `${bold("[ ! ]")} Tidak dapat memproses karena Anda telah dibanned!`,
    botAdmin: `${bold("[ ! ]")} Bot bukan admin, tidak bisa menggunakan perintah!`,
    coin: `${bold("[ ! ]")} Anda tidak punya cukup koin!`,
    group: `${bold("[ ! ]")} Perintah hanya dapat diakses dalam grup!`,
    owner: `${bold("[ ! ]")} Perintah hanya dapat diakses Owner!`,
    private: `${bold("[ ! ]")} Perintah hanya dapat diakses dalam obrolan pribadi!`,

    // Command interface.
    watermark: `${package.name}@^${package.version}`,
    footer: quote("Created by ItsReimau."),
    readmore: "\u200E".repeat(4001),

    // Command process.
    argument: `${bold("[ ! ]")} Masukkan argumen!`,
    wait: `${bold("[ ! ]")} Tunggu sebentar...`,

    // Command process (Error).
    notFound: `Tidak ada yang ditemukan!`,
    urlInvalid: `URL tidak valid!`
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
    startTime: null,
    timeZone: "Asia/Jakarta",
    useCoin: true,
    usePairingCode: true
};