// Modul dan dependensi yang diperlukan
require("./config.js");
const handler = require("./handler.js");
const pkg = require("./package.json");
const tools = require("./tools/exports.js");
const CFonts = require("cfonts");
const SimplDB = require("simpl.db");

// Buat basis data
const db = new SimplDB();

// Atur konfigurasi ke global
global.config.pkg = pkg;
global.handler = handler;
global.tools = tools;
global.db = db;

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