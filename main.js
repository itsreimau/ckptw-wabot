const smpl = require('./tools/simple.js');
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
const path = require('path');
const SimplDB = require('simpl.db');
const {
    inspect
} = require('util');

console.log('Connecting...');

// Create a new bot instance.
const bot = new Client({
    name: global.bot.name,
    prefix: global.bot.prefix,
    printQRInTerminal: true,
    readIncommingMsg: true
});

// Create a new database instance.
const db = new SimplDB();
global.db = db;

// Event handling when the bot is ready.
bot.ev.once(Events.ClientReady, (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Handle uncaughtExceptions.
process.on('uncaughtException', (err) => console.error(err));

// Create command handlers and load commands.
const cmd = new CommandHandler(bot, path.resolve(__dirname, 'commands'));
cmd.load();

// Event handling when the message appears.
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const senderNumber = ctx._sender.jid.split('@')[0];
    const senderJid = ctx._sender.jid;

    // All chat types.
    if (m.key.fromMe) return; // Checking messages.

    if (smpl.isCmd(m, ctx)) ctx.simulateTyping(); // Auto-typing,

    // AFK.
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        mentionJids.forEach(mentionJid => {
            const getAFKMention = db.get(`user.${mentionJid.split('@')[0]}.afk`);
            if (getAFKMention) {
                const {
                    timeStamp,
                    reason
                } = getAFKMention;
                const timeAgo = smpl.convertMsToDuration(Date.now() - timeStamp);
                ctx.reply(`Dia AFK dengan alasan ${reason} selama ${timeAgo || 'kurang dari satu detik.'}.`);
            }
        });
    }

    const getAFKMessage = db.get(`user.${senderNumber}.afk`);
    if (getAFKMessage) {
        const {
            timeStamp,
            reason
        } = getAFKMessage;
        const timeAgo = smpl.convertMsToDuration(Date.now() - timeStamp);
        ctx.reply(`Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo}.`);
        db.delete(`user.${senderNumber}.afk`);
    }

    // Owner-only.
    if (smpl.isOwner(senderNumber) === 1) {
        // Eval.
        if (m.content && m.content.startsWith && (m.content.startsWith('> ') || m.content.startsWith('>> '))) {
            const code = m.content.slice(2);

            const result = await eval(m.content.startsWith('>> ') ? `(async () => { ${code} })()` : code);
            await ctx.reply(inspect(result));
        }

        // Exec.
        if (m.content && m.content.startsWith && m.content.startsWith('$ ')) {
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

    // Group
    if (ctx.isGroup) {
        // What can be done here?
    }

    // Private
    if (!ctx.isGroup) {
        // Menfess
        const getMessageDataMenfess = db.get(`menfess.${senderNumber}`);
        if (getMessageDataMenfess) {
            const {
                from
            } = getMessageDataMenfess;
            await ctx.sendMessage(`${from}@s.whatsapp.net`, {
                text: `💌 Hai, saya ${global.bot.name}, Dia (${sender}) menjawab pesan menfess yang Anda kirimkan.\n` +
                    '-----\n' +
                    `${m.content}\n` +
                    '-----\n' +
                    'Jika ingin membalas, Anda harus mengirimkan perintah lagi.\n'
            });
            db.delete(`menfess.${senderNumber}`);
            return ctx.reply('Pesan berhasil terkirim!');
        }
    }
});

// Launching bot.
bot.launch().catch((error) => console.error('Error:', error));