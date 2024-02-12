require('./config.js');
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
const {
    sendStatus
} = require('./lib/simple.js');

console.log('Connecting...');

// Deklarasikan variabel global
global.startTime = null;

// Membuat instance bot baru
const bot = new Client({
    name: 'Isla (アイラ Aira)',
    prefix: /([^\w\s])/i,
    printQRInTerminal: true,
    readIncommingMsg: true
});

// Penanganan event saat bot siap
bot.ev.once(Events.ClientReady, (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.startTime = Date.now();
});

// Menangani uncaught exceptions
process.on('uncaughtException', (err) => console.error(err));

// Membuat handler perintah dan memuat perintah-perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, 'commands'));
cmd.load();

bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    try {
        // Memeriksa pesan
        if (!m.content || m.key.fromMe) return;

        // Auto-typing
        if (m.content && ctx._config.cmd instanceof Map) {
            const commandList = Array.from(ctx._config.cmd.keys());

            const isCommandIncluded = commandList.some(command => ctx._msg.content.includes(command));

            if (isCommandIncluded && (m.content.startsWith('>') || m.content.startsWith('x') || m.content.startsWith('$'))) {
                ctx.simulateTyping(); // simulateRecording, jika Anda ingin 'sedang merekam suara...'
            }
        }

        // Owner-only
        if (ctx._sender.jid.includes(global.owner)) {
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
        await ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
    }
});

// Menjalankan bot
bot.launch().catch((error) => console.error('Error:', error));