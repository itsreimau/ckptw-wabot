const smpl = require('./lib/simple.js');
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
    afk
} = require('discord-afk-js');
const {
    _ai
} = require('lowline.ai');
const moment = require('moment-timezone');
const path = require('path');
const {
    inspect
} = require('util');

_ai.init({
    apiKey: global.apiKey.lowline
});

console.log('Connecting...');

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
        if (smpl.isCmd(m, ctx)) {
            ctx.simulateTyping(); // atau ctx.simulateRecording() jika Anda ingin 'sedang merekam suara...'
        }

        // AFK
        const getMentionData = afk.get(m.message?.extendedTextMessage?.contextInfo?.mentionedJid);
        if (getMentionData) {
            const [timestamp, reason] = getMentionData;
            const timeago = moment(timestamp).fromNow();
            ctx.reply({
                text: `${ctx._sender.jid.split('@')[0]} AFK sekarang, Alasan: ${reason} ${timeago}`,
                mentions: ctx.getMentioned()
            });
        }

        const getMessageData = afk.get(m.key.participant);
        if (getMessageData) {
            afk.delete(ctx._sender.jid);
            ctx.reply({
                text: `${ctx._sender.jid.split('@')[0]}, mengeluarkan Anda dari AFK.`,
                mentions: ctx.getMentioned()
            });
        }

        // Owner-only
        if (smpl.isOwner(ctx) === 1) {
            // Eval
            if (m.content.startsWith('> ') || m.content.startsWith('>> ')) {
                const code = m.content.slice(2);

                const result = await eval(m.content.startsWith('>> ') ? `(async () => { ${code} })()` : code);
                await ctx.reply(inspect(result));
            }

            // Exec
            if (m.content.startsWith('$ ')) {
                const command = m.content.slice(2);

                const output = await new Promise((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`));
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
        console.error('Error:', error);
        return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
    }
});

// Menjalankan bot
bot.launch().catch((error) => console.error('Error:', error));