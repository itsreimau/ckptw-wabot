const pkg = require("./package.json");
const {
    bold,
    italic,
    quote
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
    admin: quote(`${bold("[ ! ]")} Perintah hanya dapat diakses oleh admin grup!`),
    banned: quote(`${bold("[ ! ]")} Tidak dapat memproses karena Anda telah dibanned!`),
    botAdmin: quote(`${bold("[ ! ]")} Bot bukan admin, tidak bisa menggunakan perintah!`),
    coin: quote(`${bold("[ ! ]")} Anda tidak punya cukup koin!`),
    group: quote(`${bold("[ ! ]")} Perintah hanya dapat diakses dalam grup!`),
    owner: quote(`${bold("[ ! ]")} Perintah hanya dapat diakses Owner!`),
    premium: quote(`${bold("[ ! ]")} Anda bukan pengguna Premium!`),
    private: quote(`${bold("[ ! ]")} Perintah hanya dapat diakses dalam obrolan pribadi!`),

    // Command interface.
    watermark: `${pkg.name}@^${pkg.version}`,
    footer: italic("Developed by ItsReimau"),
    readmore: "\u200E".repeat(4001),

    // Command process.
    argument: `${bold("[ ! ]")} Masukkan argumen!`,
    wait: `${bold("[ ! ]")} Tunggu sebentar...`,

    // Command process (Error).
    notFound: `${bold("[ ! ]")} Tidak ada yang ditemukan!`,
    urlInvalid: `${bold("[ ! ]")} URL tidak valid!`
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
    timeZone: "Asia/Jakarta",
    useCoin: true,
    useInteractiveMessage: true,
    usePairingCode: true,
    usePremium: false
};