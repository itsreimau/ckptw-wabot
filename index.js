// Import modul dan dependensi
require("./config.js");
const {
    name: pkgName,
    description,
    author
} = require("./package.json");
const tools = require("./tools/exports.js");
const {
    Consolefy
} = require("@mengkodingan/consolefy");
const CFonts = require("cfonts");
const fs = require("fs");
const http = require("http");
const path = require("path");
const SimplDB = require("simpl.db");

// Buat consolefy
const c = new Consolefy({
    tag: pkgName
});

// Buat basis data
const dbFile = path.join(__dirname, "database.json");
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "{}", "utf8");
const db = new SimplDB();

// Pengecekan dan penghapusan folder auth jika kosong
if (config.bot.authAdapter.adapter === "default") {
    const authDir = path.resolve(__dirname, config.bot.authAdapter.default.authDir);
    if (fs.existsSync(authDir) && !fs.readdirSync(authDir).length) fs.rmSync(authDir, {
        recursive: true,
        force: true
    });
}

// Atur konfigurasi ke global
Object.assign(global, {
    config,
    tools,
    consolefy: c,
    db
});

c.log("Starting..."); // Memulai

// Tampilkan judul menggunakan CFonts
CFonts.say(pkgName, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Menampilkan informasi paket
CFonts.say(
    `'${description}'\n` +
    `By ${author}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Jalankan server jika diaktifkan
if (config.system.useServer) {
    const {
        port
    } = config.system;
    http.createServer((_, res) => res.end(`${pkgName} is running on port ${port}`)).listen(port, () => {
        c.success(`Server is running at http://localhost:${port}`);
    });
}

require("./main.js"); // Impor dan jalankan modul utama