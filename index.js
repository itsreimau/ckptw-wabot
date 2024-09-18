require("./config.js");
const pkg = require("./package.json");
const CFonts = require("cfonts");

// Mendefinisikan.
global.config.pkg = pkg;

// Pengecekan.
if (global.config.owner.name === "John Doe" || global.config.owner.number === "628xxxxxxxxxx") {
    console.error(`[${pkg.name}] Harap tetapkan global.config.owner dengan benar di config.js!`);
    process.exit(1);
}
if (global.config.system.usePairingCode && global.config.bot.phoneNumber === "628xxxxxxxxxx") {
    console.error(`[${pkg.name}] Harap tetapkan global.config.bot.phoneNumber dengan benar di config.js!`);
    process.exit(1);
}

// Memulai.
console.log(`[${pkg.name}] Memulai...`);

// Tampilkan judul menggunakan CFonts.
CFonts.say(pkg.name, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Menampilkan informasi paket.
const authorName = pkg.author.name || pkg.author;
CFonts.say(
    `'${pkg.description}'\n` +
    `Oleh ${authorName}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Impor dan jalankan modul utama.
require("./main.js");