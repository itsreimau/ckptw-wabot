require('./config.js');
const {
    isCmd
} = require('./lib/simple.js');
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
    exec
} = require('child_process');
const {
    _ai
} = require('lowline.ai');
const path = require('path');
const {
    inspect
} = require('util');

_ai.init({
    apiKey: 'REPLACE_THIS_WITH_YOUR_API_KEY' // Dapatkan di: https://www.lowline.ai/
});

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

// Penanganan event saat pesan muncul
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    try {
        // Memeriksa pesan
        if (!m.content || m.key.fromMe) return;

        // Auto-typing
        if (isCmd(m, ctx)) {
            ctx.simulateTyping(); // atau ctx.simulateRecording() jika Anda ingin 'sedang merekam suara...'
        }

        // Rei Ayanami
        if (m.content && /\b(rei|ayanami)\b/i.test(m.content)) {
            ctx.simulateTyping();

            const currentDate = new Date().toLocaleString('id-ID', {
                timeZone: 'Asia/Jakarta'
            });
            const result = await _ai.generatePlaintext({
                prompt: `You are Rei Ayanami, a cute anime girl based on the AI assistant from Neon Genesis Evangelion created by Muhammad Ikbal Maulana aka ItsReimau. You will receive a message from the user, then you will respond.\n` +
                    `Current date: ${currentDate}\n` +
                    `User's message: ${m.content}\n` +
                    `Your response: `
            });

            await ctx.reply(result);
        }


        // Owner-only
        if (ctx._sender.jid.includes(global.owner.number)) {
            // Eval
            if (m.content.startsWith('> ') || m.content.startsWith('x ')) {
                const code = m.content.slice(2);

                const result = await eval(m.content.startsWith('x ') ? `(async () => { ${code} })()` : code);
                await ctx.reply(inspect(result));
            }

            // Exec
            if (m.content.startsWith('$ ')) {
                const command = m.content.slice(2);

                const output = await new Promise((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(`Error: ${error.message}`));
                        } else if (stderr) {
                            reject(new Error(stderr));
                        } else {
                            resolve(stdout);
                        }
                    });
                });

                await ctx.reply(output);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
    }
});

// Menjalankan bot
bot.launch().catch((error) => console.error('Error:', error));