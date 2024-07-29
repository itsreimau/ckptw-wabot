// Required modules and dependencies.
const handler = require("./handler.js");
const {
    general
} = require("./tools/exports.js");
const {
    bold,
    Client,
    CommandHandler
} = require("@mengkodingan/ckptw");
const {
    Events,
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const {
    exec
} = require("child_process");
const path = require("path");
const SimplDB = require("simpl.db");
const {
    inspect
} = require("util");

// Connection message.
console.log("Connecting...");

// Create a new bot instance.
const bot = new Client({
    prefix: global.bot.prefix,
    readIncommingMsg: true,
    printQRInTerminal: !global.system.usePairingCode,
    phoneNumber: global.bot.phoneNumber,
    usePairingCode: global.system.usePairingCode,
    selfReply: true
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

// Assign global handler.
global.handler = handler;

// Event handling when a message appears.
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const senderNumber = ctx._sender.jid.split("@")[0];
    const senderJid = ctx._sender.jid;
    const groupNumber = ctx.isGroup() ? m.key.remoteJid.split("@")[0] : null;
    const groupJid = ctx.isGroup() ? m.key.remoteJid : null;
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;

    // Ignore messages sent by the bot itself.
    if (m.key.fromMe) return;

    // Auto-typing simulation for commands.
    if (general.isCmd(m, ctx)) ctx.simulateTyping();

    // AFK handling: Mentioned users.
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        for (const mentionJid of mentionJids) {
            const getAFKMention = db.get(`user.${mentionJid.split("@")[0]}.afk`);
            if (getAFKMention) {
                const [reason, timeStamp] = await Promise.all([
                    db.get(`user.${mentionJid.split("@")[0]}.afk.reason`),
                    db.get(`user.${mentionJid.split("@")[0]}.afk.timeStamp`)
                ]);
                const timeAgo = general.convertMsToDuration(Date.now() - timeStamp);

                return ctx.reply(`Dia AFK dengan alasan ${reason} selama ${timeAgo || "kurang dari satu detik."}.`);
            }
        }
    }

    // AFK handling: Returning from AFK.
    const getAFKMessage = await db.get(`user.${senderNumber}.afk`);
    if (getAFKMessage) {
        const [reason, timeStamp] = await Promise.all([
            db.get(`user.${senderNumber}.afk.reason`),
            db.get(`user.${senderNumber}.afk.timeStamp`)
        ]);
        const timeAgo = general.convertMsToDuration(Date.now() - timeStamp);
        await db.delete(`user.${senderNumber}.afk`);

        return ctx.reply(`Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo || "kurang dari satu detik."}.`);
    }

    // Owner-only commands.
    if (general.isOwner(ctx, senderNumber) === 1) {
        // Eval command: Execute JavaScript code.
        if (m.content && m.content.startsWith && (m.content.startsWith("> ") || m.content.startsWith(">> "))) {
            const code = m.content.slice(2);

            try {
                const result = await eval(m.content.startsWith(">> ") ? `(async () => { ${code} })()` : code);

                return await ctx.reply(inspect(result));
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
            }
        }

        // Exec command: Execute shell commands.
        if (m.content && m.content.startsWith && m.content.startsWith("$ ")) {
            const command = m.content.slice(2);

            try {
                const output = await execPromise(command);

                return await ctx.reply(output);
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
            }
        }
    }

    // Group-specific actions.
    if (isGroup) {
        // Antilink handling.
        const getAntilink = await db.get(`group.${groupNumber}.antilink`);
        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (getAntilink && m.content && urlRegex.test(m.content)) {
            if ((await general.isAdmin(ctx)) === 1) return;

            await ctx.reply(`${bold("[ ! ]")} Jangan kirim tautan!`);
            return await ctx.deleteMessage(m.key);
        }
    }

    // Private messages.
    if (isPrivate) {
        // Menfess handling.
        const getMessageDataMenfess = await db.get(`menfess.${senderNumber}`);
        if (getMessageDataMenfess) {
            if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation === m.content) {
                const from = await db.get(`menfess.${senderNumber}.from`);
                try {
                    await sendMenfess(ctx, m, senderNumber, from);

                    return ctx.reply("Pesan berhasil terkirim!");
                } catch (error) {
                    console.error("Error:", error);
                    return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
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
async function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(error.message));
            } else if (stderr) {
                reject(new Error(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
}

async function sendMenfess(ctx, m, senderNumber, from) {
    await ctx.sendMessage(`${from}@s.whatsapp.net`, {
        text: `❖ ${bold("Menfess")}\n` +
            `Hai, saya ${global.bot.name}, Dia (${senderNumber}) menjawab pesan menfess yang Anda kirimkan.\n` +
            "-----\n" +
            `${content}\n` +
            "-----\n" +
            "Jika ingin membalas, Anda harus mengirimkan perintah lagi.\n"
    }, {
        quoted: m.key
    });
}

async function handleUserEvent(m) {
    const {
        id,
        participants
    } = m;

    try {
        const getWelcome = await db.get(`group.${id.split("@")[0]}.welcome`);
        if (getWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profileUrl;
                try {
                    profileUrl = await bot.core.profilePictureUrl(jid, "image");
                } catch {
                    profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
                }

                const message = m.eventsType === "UserJoin" ? `Selamat datang @${jid.split("@")[0]} di grup ${metadata.subject}!` : `@${jid.split("@")[0]} keluar dari grup ${metadata.subject}.`;

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
                            thumbnailUrl: profileUrl,
                            sourceUrl: global.bot.groupChat
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return bot.core.sendMessage(id, {
            text: `${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`
        });
    }
}