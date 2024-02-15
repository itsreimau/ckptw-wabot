const packageJson = require('./package.json');
const CFonts = require('cfonts');

console.log('Starting...');

// Menampilkan judul menggunakan CFonts
CFonts.say('Lightweight\nWhatsApp Bot', {
    font: 'chrome',
    align: 'center',
    gradient: ['red', 'magenta']
});

// Menampilkan informasi paket
const authorName = packageJson.author.name || packageJson.author;
CFonts.say(`'${packageJson.name}' by ${authorName}`, {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
});

// Mengimpor dan menjalankan modul utama
require('./main.js');