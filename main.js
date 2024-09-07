// Required modules and dependencies.
const handler = require("./handler.js");
const tools = require("./tools/exports.js");
const {
    Client,
    CommandHandler,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    Events,
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");
const {
    exec
} = require("child_process");
const didyoumean = require("didyoumean");
const path = require("path");
const SimplDB = require("simpl.db");
const {
    inspect
} = require("util");

// Connection message.
console.log("Connecting...");

// Create a new bot instance.
const bot = new Client({
    WAVersion: [2, 3000, 1015901307],
    phoneNumber: global.bot.phoneNumber,
    prefix: global.bot.prefix,
    readIncommingMsg: global.system.autoRead,
    printQRInTerminal: !global.system.usePairingCode,
    selfReply: global.system.selfReply,
    usePairingCode: global.system.usePairingCode
});

// Create a new database instance.
const db = new SimplDB();
global.db = db;

// Event handling when the bot is ready.
bot.ev.once(Events.ClientReady, async (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Create command handlers and load commands.
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Assign global handler and tools.
global.handler = handler;
global.tools = tools;

// Event handling when a message appears.
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.replace(/@.*|:.*/g, "");
    const groupJid = isGroup ? m.key.remoteJid : null;
    const groupNumber = isGroup ? groupJid.replace(/@.*|:.*/g, "") : null;

    // Database for user.
    const userDb = await db.get(`user.${senderNumber}`);
    if (!userDb) {
        await db.set(`user.${senderNumber}`, {
            coin: 10,
            isBanned: false,
            isPremium: false,
            language: senderNumber.startsWith("62") ? "id" : "en"
        });
    }
    const [userLanguage] = await Promise.all([
        db.get(`user.${senderNumber}.language`)
    ]);


    // Auto-typing simulation for commands.
    if (tools.general.isCmd(m, ctx)) await ctx.simulateTyping();

    // "Did you mean?" for typo commands.
    const prefixRegex = new RegExp(ctx._config.prefix, "i");
    const content = m.content && m.content.trim();
    if (prefixRegex.test(content)) {
        const prefix = content.charAt(0);
        const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);
        const listCmd = Array.from(ctx._config.cmd.values()).flatMap(command => {
            const aliases = Array.isArray(command.aliases) ? command.aliases : [];
            return [command.name, ...aliases];
        });

        const mean = didyoumean(cmdName, listCmd);

        if (mean && mean !== cmdName) await ctx.reply(quote(`❓ ${await tools.msg.translate("Apakah maksud Anda", userLanguage)} ${monospace(prefix + mean)}?`));
    }

    // AFK handling: Mentioned users.
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        for (const mentionJid of mentionJids) {
            const getAFKMention = await db.get(`user.${mentionJid.replace(/@.*|:.*/g, "")}.afk`);
            if (getAFKMention) {
                const [reason, timeStamp] = await Promise.all([
                    db.get(`user.${mentionJid.replace(/@.*|:.*/g, "")}.afk.reason`),
                    db.get(`user.${mentionJid.replace(/@.*|:.*/g, "")}.afk.timeStamp`)
                ]);
                const timeAgo = tools.general.convertMsToDuration(Date.now() - timeStamp) || "kurang dari satu detik.";

                await ctx.reply(quote(`🚫 ${await tools.msg.translate(`Dia AFK dengan alasan ${reason} selama ${timeAgo}.`, userLanguage)}`));
            }
        }
    }

    // AFK handling: Leaving from AFK.
    const getAFKMessage = await db.get(`user.${senderNumber}.afk`);
    if (getAFKMessage) {
        const [reason, timeStamp] = await Promise.all([
            db.get(`user.${senderNumber}.afk.reason`),
            db.get(`user.${senderNumber}.afk.timeStamp`)
        ]);
        const timeAgo = tools.general.convertMsToDuration(Date.now() - timeStamp) || "kurang dari satu detik.";
        await db.delete(`user.${senderNumber}.afk`);

        await ctx.reply(quote(`📴 ${await tools.msg.translate(`Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo}`, userLanguage)}`));
    }

    // Owner-only commands.
    if (tools.general.isOwner(ctx, {
            id: senderNumber,
            selfOwner: true
        }) === 1) {
        // Eval command: Execute JavaScript code.
        if (m.content && m.content.startsWith && (m.content.startsWith("$>> ") || m.content.startsWith("$> "))) {
            const code = m.content.startsWith("$>> ") ? m.content.slice(3) : m.content.slice(2);

            try {
                const result = await eval(m.content.startsWith("$>> ") ? `(async () => { ${code} })()` : code);
                await ctx.reply(inspect(result));
            } catch (error) {
                console.error("Error:", error);
                await ctx.reply(quote(`⚠ ${await tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
            }
        }

        // Exec command: Execute shell commands.
        if (m.content && m.content.startsWith && m.content.startsWith("$ ")) {
            const command = m.content.slice(2);

            try {
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
            } catch (error) {
                console.error("Error:", error);
                await ctx.reply(quote(`⚠ ${await tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
            }
        }
    }

    // Group-specific actions.
    if (isGroup) {
        // Antilink handling.
        const getAntilink = await db.get(`group.${groupNumber}.antilink`);
        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (getAntilink && urlRegex.test(m.content)) {
            if ((await tools.general.isAdmin(ctx)) === 1) return; // Skip admins.

            await ctx.reply(quote(`⚠ ${await tools.msg.translate("Jangan kirim tautan!", userLanguage)}`));
            await ctx.deleteMessage(m.key);
        }
    }

    // Private messages.
    if (isPrivate) {
        // Menfess handling.
        const getMessageDataMenfess = await db.get(`menfess.${senderNumber}`);
        if (getMessageDataMenfess) {
            const [from, text] = await Promise.all([
                db.get(`menfess.${senderNumber}.from`),
                db.get(`menfess.${senderNumber}.text`)
            ]);

            if (ctx.quoted?.extendedTextMessage?.text === text) {
                try {
                    await sendMenfess(ctx, m, senderNumber, from);
                    await ctx.reply(quote(`✅ ${await tools.msg.translate("Pesan berhasil terkirim!", userLanguage)}`));
                } catch (error) {
                    console.error("Error:", error);
                    await ctx.reply(quote(`⚠ ${await tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
                }
            }
        }
    }
});


// Event handling when a user joins or leaves a group
bot.ev.on(Events.UserJoin, (m) => {
    m.eventsType = "UserJoin";
    handleUserEvent(m);
});

bot.ev.on(Events.UserLeave, (m) => {
    m.eventsType = "UserLeave";
    handleUserEvent(m);
});


// Launch the bot.
bot.launch().catch((error) => console.error("Error:", error));

// Utility functions
async function sendMenfess(ctx, m, senderNumber, from) {
    const fakeText = {
        key: {
            fromMe: false,
            participant: senderNumber + S_WHATSAPP_NET,
            ...({
                remoteJid: "status@broadcast"
            })
        },
        message: {
            extendedTextMessage: {
                text: await tools.msg.translate(`${senderNumber} telah merespons pesan menfess Anda.`, userLanguage),
                title: global.bot.name,
                thumbnailUrl: global.bot.thumbnail

            }
        }
    }

    await ctx.sendMessage(
        from + S_WHATSAPP_NET, {
            text: `${m.content}\n` +
                `${global.msg.readmore}\n` +
                await tools.msg.translate("Jika ingin membalas, Anda harus mengirimkan perintah lagi.", userLanguage),
            contextInfo: {
                mentionedJid: [senderNumber + S_WHATSAPP_NET],
                externalAdReply: {
                    mediaType: 1,
                    previewType: 0,
                    mediaUrl: global.bot.groupChat,
                    title: global.msg.watermark,
                    body: null,
                    renderLargerThumbnail: true,
                    thumbnailUrl: global.bot.thumbnail,
                    sourceUrl: global.bot.groupChat
                },
                forwardingScore: 9999,
                isForwarded: true
            },
            mentions: [senderNumber + S_WHATSAPP_NET]
        }, {
            quoted: fakeText
        }
    );
}

async function handleUserEvent(m) {
    const {
        id,
        participants
    } = m;

    try {
        const getWelcome = await db.get(`group.${id.replace(/@.*|:.*/g, "")}.welcome`);
        if (getWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profileUrl;
                try {
                    profileUrl = await bot.core.profilePictureUrl(jid, "image");
                } catch {
                    profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
                }

                const message = m.eventsType === "UserJoin" ?
                    quote(`⚠ ${await tools.msg.translate(`Selamat datang @${jid.replace(/@.*|:.*/g, "")} di grup ${metadata.subject}!`, userLanguage)}`) :
                    quote(`⚠ ${await tools.msg.translate(`@${jid.replace(/@.*|:.*/g, "")} keluar dari grup ${metadata.subject}.`, userLanguage)}`);
                const card = tools.api.createUrl("aggelos_007", "/welcomecard", {
                    text1: jid.replace(/@.*|:.*/g, ""),
                    text2: m.eventsType === "UserJoin" ? "WELCOME" : "GOODBYE",
                    text3: metadata.subject,
                    avatar: profileUrl,
                    background: global.bot.thumbnail
                });

                await bot.core.sendMessage(id, {
                    text: message,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: global.bot.groupChat,
                            title: m.eventsType === "UserJoin" ? "JOIN" : "LEAVE",
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: card || profileUrl || global.bot.thumbnail,
                            sourceUrl: global.bot.groupChat
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        await bot.core.sendMessage(id, {
            text: quote(`⚠ ${await tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`)
        });
    }
}