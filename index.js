 // Modul dan dependensi yang diperlukan
 require("./config.js");
 const handler = require("./handler.js");
 const pkg = require("./package.json");
 const tools = require("./tools/exports.js");
 const CFonts = require("cfonts");
 const fs = require("fs");
 const http = require("http");
 const path = require("path");
 const SimplDB = require("simpl.db");

 // Buat basis data
 const db = new SimplDB();
 const dbFile = path.join(__dirname, "database.json");
 if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({}), "utf8");

 // Atur konfigurasi ke global
 global.handler = handler;
 global.config.pkg = pkg;
 global.tools = tools;
 global.db = db;

 // Memulai
 console.log(`[${pkg.name}] Starting...`);

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

 // Fungsi untuk menjalankan server jika diaktifkan
 if (config.system.useServer) {
     const port = config.system.port || 3000;
     const server = http.createServer((req, res) => {
         res.writeHead(200, {
             "Content-Type": "text/plain"
         });
         res.end(`${pkg.name} is running on port ${port}`);
     });

     server.listen(port, () => {
         console.log(`[${pkg.name}] Server is running at http://localhost:${port}`);
     });
 }

 // Impor dan jalankan modul utama
 require("./main.js");