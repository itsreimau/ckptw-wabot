const {
    handler
} = require('./handler.js');
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
const fg = require('api-dylux');
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

// Create a handlers.
global.handler = handler;

// Event handling when the message appears.
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const senderNumber = ctx._sender.jid.split('@')[0];
    const senderJid = ctx._sender.jid;
    const groupNumber = ctx.isGroup ? m.key.remoteJid.split('@')[0] : null;
    const groupJid = ctx.isGroup ? m.key.remoteJid : null;
    const isOwner = global.owner.number === senderNumber;
    const isGroup = ctx._msg.key.remoteJid.endsWith('@g.us');
    const isPrivate = ctx._msg.key.remoteJid.endsWith('@s.whatsapp.net');

    // All chat types.
    if (m.key.fromMe) return; // Checking messages.

    if (smpl.isCmd(m, ctx)) ctx.simulateTyping(); // Auto-typing.

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
    if (isOwner) {
        // Eval.
        if (m.content && m.content.startsWith && (m.content.startsWith('> ') || m.content.startsWith('>> '))) {
            const code = m.content.slice(2);

            try {
                const result = await eval(m.content.startsWith('>> ') ? `(async () => { ${code} })()` : code);

                return await ctx.reply(inspect(result));
            } catch (error) {
                console.error('Error:', error);
                return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
            }
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

            return await ctx.reply(output);
        }
    }

    // Group.
    if (isGroup) {
        if (db.get(`group.${groupNumber}.antilink`)) {
            const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;

            if (m.message && m.message.extendedTextMessage && (m.message.extendedTextMessage.inviteLinkGroupTypeV2 || urlRegex.test(m.content))) {
                ctx.deleteMessage(m.key);
                /* If you want automatic kick, use this.
                await ctx._client.groupParticipantsUpdate(ctx.id, [senderNumber], 'remove'); */

                return ctx.reply('Jangan kirim tautan!');
            }
        }
    }


    // Private.
    if (isPrivate) {
        // Menfess.
        const getMessageDataMenfess = db.get(`menfess.${senderNumber}`);

        if (getMessageDataMenfess) {
            const {
                from
            } = getMessageDataMenfess;

            try {
                await ctx.sendMessage(`${from}@s.whatsapp.net`, {
                    text: `💌 Hai, saya ${global.bot.name}, Dia (${senderNumber}) menjawab pesan menfess yang Anda kirimkan.\n` +
                        '-----\n' +
                        `${m.content}\n` +
                        '-----\n' +
                        'Jika ingin membalas, Anda harus mengirimkan perintah lagi.\n'
                });
                db.delete(`menfess.${senderNumber}`);
                return ctx.reply('Pesan berhasil terkirim!');
            } catch (error) {
                console.error('Error:', error);
                return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
            }
        }
    }
});

bot.ev.once(Events.UserJoin, async (m) => {
    const {
        id,
        participants
    } = m;

    try {
        const metadata = await bot.core.groupMetadata(id);

        // Participants.
        for (const jid of participants) {
            // Get profile picture user.
            let profile;
            try {
                profile = await bot.core.profilePictureUrl(jid, 'image');
            } catch {
                const thumbnail = await fg.googleImage('rei ayanami wallpaper');
                profile = smpl.getRandomElement(thumbnail);
            }

            if (!db.get(`group.${id.split('@')[0]}.welcome`)) return;
            bot.core.sendMessage(id, {
                text: `Selamat datang @${jid.split('@')[0]} di grup ${metadata.subject}!`,
                contextInfo: {
                    mentionedJid: [jid],
                    externalAdReply: {
                        title: `ADD`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profile,
                        sourceUrl: global.bot.groupChat
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return bot.core.sendMessage(id, {
            text: `${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`
        });
    }
});

bot.ev.once(Events.UserLeave, async (m) => {
    const {
        id,
        participants
    } = m;

    try {
        const metadata = await bot.core.groupMetadata(id);

        // Participants.
        for (const jid of participants) {
            // Get profile picture user.
            let profile;
            try {
                profile = await bot.core.profilePictureUrl(jid, 'image');
            } catch {
                const thumbnail = await fg.googleImage('rei ayanami wallpaper');
                profile = smpl.getRandomElement(thumbnail);
            }

            if (!db.get(`group.${id.split('@')[0]}.welcome`)) return;
            bot.core.sendMessage(id, {
                text: `@${jid.split('@')[0]} keluar dari grup ${metadata.subject}.`,
                contextInfo: {
                    mentionedJid: [jid],
                    externalAdReply: {
                        title: `REMOVE`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profile,
                        sourceUrl: global.bot.groupChat
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return bot.core.sendMessage(id, {
            text: `${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`
        });
    }
});

// Launching bot.
bot.launch().catch((error) => console.error('Error:', error));