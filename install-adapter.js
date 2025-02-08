// Import modul dan dependensi
require("./config.js");
const {
    name: pkgName
} = require("./package.json");
const {
    execSync
} = require("child_process");

// Buat consolefy
const c = new Consolefy({
    tag: pkgName
});

// Mendapatkan adapter autentikasi dari konfigurasi
const {
    adapter
} = config.bot.authAdapter;

// Daftar modul untuk setiap adapter autentikasi
const modules = {
    mysql: "baileys-mysql",
    mongodb: "baileys-mongodb",
    firebase: "baileys-firebase",
};

// Pasang modul jika adapter ditemukan dalam daftar
if (modules[adapter]) {
    Consolefy.log(`Installing ${adapter} module...`);
    execSync(`npm install ${modules[adapter]} --no-save`, {
        stdio: "inherit"
    });
} else {
    Consolefy.log("No database module required or adapter is not set.");
}