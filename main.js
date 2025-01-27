// Modul dan dependensi yang diperlukan
const events = require("./events/handler.js");
const {
    Client,
    CommandHandler
} = require("@mengkodingan/ckptw");
const {
    useFireAuthState
} = require("baileys-firebase");
const {
    useMongoAuthState
} = require("baileys-mongodb");
const {
    useSqlAuthState
} = require("baileys-mysql");
const path = require("path");

// Pesan koneksi
console.log(`Connecting...`);

// Pilih adapter autentikasi
const authAdapter = (() => {
    const {
        adapter,
        mysql,
        mongodb,
        firebase
    } = config.bot.authAdapter;
    switch (adapter) {
        case "mysql":
            return useSqlAuthState(mysql);
        case "mongodb":
            return useMongoAuthState(mongodb.url);
        case "firebase":
            return useFireAuthState(firebase);
        default:
            return undefined;
    }
})();

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
    usePairingCode: config.system.usePairingCode,
    authAdapter
});

// Penanganan events
events(bot);

// Buat penangan perintah dan muat perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Luncurkan bot
bot.launch().catch((error) => console.error(`Error: ${error}`));