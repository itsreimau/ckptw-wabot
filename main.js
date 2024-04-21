const economyConfig = require('./economy.config.js');
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
const moment = require('moment-timezone');
const path = require('path');
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
    try {
        // Checking messages.
        if (!m.content || m.key.fromMe) return;

        // Auto-typing.
        if (smpl.isCmd(m, ctx)) {
            ctx.simulateTyping(); // ctx.simulateRecording();
        }

        // AFK.
        const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentionJids && mentionJids.length > 0) {
            mentionJids.forEach(mentionJid => {
                const getMentionData = afk.get(mentionJid);
                if (getMentionData) {
                    const [timestamp, reason] = getMentionData;
                    const timeago = moment(timestamp).fromNow();
                    ctx.reply(`Dia AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'} selama ${timeago}`);
                }
            });
        }

        const getMessageData = afk.get(m.key.participant);
        if (getMessageData) {
            const [timestamp, reason] = getMessageData;
            const timeago = moment(timestamp).fromNow();
            afk.delete(ctx._sender.jid);
            ctx.reply(`Anda mengakhiri AFK${reason ? ` setelah ${reason}` : ''} selama ${timeago}.`);
        }

        // Owner-only.
        if (smpl.isOwner(ctx) === 1) {
            // Eval.
            if (m.content.startsWith('> ') || m.content.startsWith('>> ')) {
                const code = m.content.slice(2);

                const result = await eval(m.content.startsWith('>> ') ? `(async () => { ${code} })()` : code);
                await ctx.reply(inspect(result));
            }

            // Exec.
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

// Launching bot.
bot.launch().catch((error) => console.error('Error:', error));