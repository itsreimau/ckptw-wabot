require("./config.js");
const pkg = require("./package.json");
const CFonts = require("cfonts");

// Mendefinisikan.
global.config.pkg = pkg;

// Pengecekan.
if (global.config.owner.name === "" || global.config.owner.number === "") {
    console.error(`[${pkg.name}] Please set 'global.config.owner' correctly in config.js!`);
    process.exit(1);
}
if (global.config.system.usePairingCode && global.config.bot.phoneNumber === "") {
    console.error(`[${pkg.name}] Please set 'global.config.bot.phoneNumber' correctly in config.js!`);
    process.exit(1);
}

// Memulai.
console.log(`[${pkg.name}] Starting...`);

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
    `By ${authorName}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Impor dan jalankan modul utama.
require("./main.js");