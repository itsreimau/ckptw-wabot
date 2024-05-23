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
    name: "Rei Ayanami",
    prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
    phoneNumber: "628xxxxxxxxxx", // Ignore if you use QR code for authentication
    thumbnail: "https://userstyles.org/style_screenshots/261795_after.jpeg?r=1715414479",
    groupChat: "https://chat.whatsapp.com/FlqTGm4chSjKMsijcqAIJs"
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
    footer: quote("Dibuat oleh ItsReimau | Take care of yourself."),
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
    name: "ItsReimau",
    number: "6283838039693",
    organization: "Kumaha Aing",
    co: ["6285176804719", "6282191385540"]
};

// Sticker.
global.sticker = {
    packname: "Take care of yourself.",
    author: "@rei-ayanami"
};

// System.
global.system = {
    startTime: null,
    timeZone: "Asia/Jakarta",
    usePairingCode: true
};