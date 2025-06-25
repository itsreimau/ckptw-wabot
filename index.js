// Impor modul dan dependensi yang diperlukan
require("./config.js");
const pkg = require("./package.json");
const tools = require("./tools/exports.js");
const {
    Formatter
} = require("@itsreimau/gktw");
const {
    Consolefy
} = require("@mengkodingan/consolefy");
const CFonts = require("cfonts");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const SimplDB = require("simpl.db");

// Inisialisasi Consolefy untuk logging
const c = new Consolefy({
    tag: pkg.name
});

// Inisialisasi SimplDB untuk Database
const dbFile = path.join(__dirname, "database.json");
if (!fs.access(dbFile)) fs.writeFile(dbFile, "{}", "utf8");

// Tetapkan variabel global
config.bot.version = `v${pkg.version}`;
Object.assign(global, {
    config,
    consolefy: c,
    db: new SimplDB(),
    formatter: Formatter,
    tools
});

c.log("Starting..."); // Logging proses awal

// Tampilkan nama proyek
CFonts.say(pkg.name, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Tampilkan deskripsi dan informasi pengembang
CFonts.say(
    `'${pkg.description}'\n` +
    `By ${pkg.author}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Jalankan server jika diaktifkan dalam konfigurasi
if (config.system.useServer) {
    const {
        port
    } = config.system;
    http.createServer(res => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => c.success(`${pkg.name} runs on port ${port}`));
}

require("./main.js"); // Jalankan modul utama