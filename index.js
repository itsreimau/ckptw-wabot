// Modul dan dependensi yang diperlukan
require("./config.js");
const handler = require("./handler.js");
const pkg = require("./package.json");
const tools = require("./tools/exports.js");
const CFonts = require("cfonts");
const SimplDB = require("simpl.db");

// Buat basis data
const db = new SimplDB();

// Buat regex
const regex = {
    universalUrl: /((https?):\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i,
    groupChatUrl: /((https?):\/\/)?(www\.)?chat\.whatsapp\.com\/([a-zA-Z0-9_-]{22})/i,
    antiToxic: /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i
};

// Atur konfigurasi ke global
global.handler = handler;
global.config.pkg = pkg;
global.tools = tools;
global.db = db;
global.regex = regex;

// Memulai
console.log(`[${pkg.name}] Stating...`);

// Tampilkan judul menggunakan CFonts
CFonts.say(pkg.name, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Menampilkan informasi paket
const authorName = pkg.author.name || pkg.author;
CFonts.say(
    `'${pkg.description}'\n` +
    `By ${authorName}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Impor dan jalankan modul utama
require("./main.js");