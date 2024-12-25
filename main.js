// Modul dan dependensi yang diperlukan
const events = require("./events/handler.js");
const {
    Client,
    CommandHandler
} = require("@mengkodingan/ckptw");
const path = require("path");

// Pesan koneksi
console.log(`[${config.pkg.name}] Connecting...`);

// Buat instance bot baru
const bot = new Client({
    WAVersion: [2, 3000, 1015901307],
    autoMention: config.system.autoMention,
    markOnlineOnConnect: config.system.alwaysOnline,
    phoneNumber: config.bot.phoneNumber,
    prefix: config.bot.prefix,
    readIncommingMsg: config.system.autoRead,
    printQRInTerminal: !config.system.usePairingCode,
    selfReply: config.system.selfReply,
    usePairingCode: config.system.usePairingCode
});

// Penanganan events
events(bot);

// Buat penangan perintah dan muat perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Luncurkan bot
bot.launch().catch((error) => console.error(`[${config.pkg.name}] Error:`, error));