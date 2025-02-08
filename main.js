// Import modul dan dependensi
const path = require("path");
const middleware = require("./middleware.js");
const events = require("./events/handler.js");
const {
    Client,
    CommandHandler
} = require("@mengkodingan/ckptw");

// Konfigurasi bot
const {
    bot: botConfig,
    system
} = config;
const {
    prefix,
    phoneNumber,
    authAdapter
} = botConfig;

// Pilih adapter autentikasi
const adapters = {
    mysql: () => require("baileys-mysql").useSqlAuthState(authAdapter.mysql),
    mongodb: () => require("baileys-mongodb").useMongoAuthState(authAdapter.mongodb.url),
    firebase: () => require("baileys-firebase").useFireAuthState(authAdapter.firebase),
};
const selectedAuthAdapter = adapters[authAdapter.adapter] ? adapters[authAdapter.adapter]() : null;

// Buat instance bot
const bot = new Client({
    prefix,
    phoneNumber,
    authAdapter: selectedAuthAdapter,
    authDir: authAdapter.adapter === "default" ? path.resolve(__dirname, authAdapter.default.authDir) : null,
    readIncommingMsg: system.autoRead,
    printQRInTerminal: !system.usePairingCode,
    markOnlineOnConnect: system.alwaysOnline,
    usePairingCode: system.usePairingCode,
    selfReply: system.selfReply,
    autoMention: system.autoMention,
    WAVersion: [2, 3000, 1015901307],
});

// Inisialisasi event dan middleware
events(bot);
middleware(bot);

// Muat dan jalankan command handler
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

bot.launch().catch(error => consolefy.error(`Error: ${error}`)); // Luncurkan bot dengan penanganan error