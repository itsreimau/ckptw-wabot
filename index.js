require('./config.js');
const package = require('./package.json');
const CFonts = require('cfonts');

console.log('Starting...');

// Menampilkan judul menggunakan CFonts
CFonts.say(package.name, {
    font: 'chrome',
    align: 'center',
    gradient: ['red', 'magenta']
});

// Menampilkan informasi paket
const authorName = package.author.name || package.author;
CFonts.say(
    `'${package.description}'\n` +
    `By ${authorName}`, {
        font: 'console',
        align: 'center',
        gradient: ['red', 'magenta']
    });

// Mengimpor dan menjalankan modul utama
require('./main.js');