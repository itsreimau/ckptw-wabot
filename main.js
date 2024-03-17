require('./config.js');
const {
    isCmd
} = require('../lib/simple.js');
const {
    bold,
    Client,
    CommandHandler
} = require('@mengkodingan/ckptw');
const {
    Events,
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const {
    inspect
} = require('util');
const path = require('path');
const {
    exec
} = require('child_process');

console.log('Connecting...');

// Deklarasikan variabel global system
global.system = {
    startTime: null
}

// Membuat instance bot baru
const bot = new Client({
    name: global.bot.name,
    prefix: global.bot.prefix,
    printQRInTerminal: true,
    readIncommingMsg: true
});

// Penanganan event saat bot siap
bot.ev.once(Events.ClientReady, (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Menangani uncaughtExceptions
process.on('uncaughtException', (err) => console.error(err));

// Membuat handler perintah dan memuat perintah-perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, 'commands'));
cmd.load();

bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    try {
        // Memeriksa pesan
        if (!m.content || m.key.fromMe) return;

        // Auto-typing
        if (isCmd(m, ctx)) {
            ctx.simulateTyping(); // atau ctx.simulateRecording() jika Anda ingin 'sedang merekam suara...'
        }
    }
});

// Menjalankan bot
bot.launch().catch((error) => console.error('Error:', error));