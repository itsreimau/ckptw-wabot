require("./config.js");
const pkg = require("./package.json");
const CFonts = require("cfonts");

console.log("[ckptw-wabot] Memulai...");

// Pengecekan owner.
if (global.owner.name === "John Doe" || global.owner.number === "628xxxxxxxxxx") {
    console.error("[ckptw-wabot] Harap tetapkan global.owner dengan benar di config.js!");
    process.exit(1);
}

// Pengecekan nomor bot saat pairing code digunakan.
if (global.system.usePairingCode && global.bot.phoneNumber === "628xxxxxxxxxx") {
    console.error("[ckptw-wabot] Harap tetapkan global.bot.phoneNumber dengan benar di config.js!");
    process.exit(1);
}

// Pengecekan konsistensi antara useEnergy dan usePremium.
if ((global.system.useEnergy && !global.system.usePremium) || (!global.system.useEnergy && global.system.usePremium)) {
    console.error("global.system.useEnergy dan global.system.usePremium harus keduanya true atau false.");
    process.exit(1);
}

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