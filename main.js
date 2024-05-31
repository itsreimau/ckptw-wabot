// Required modules and dependencies
const {
    handler
} = require("./handler.js");
const smpl = require("./tools/simple.js");
const {
    bold,
    Client,
    CommandHandler
} = require("@mengkodingan/ckptw");
const {
    Events,
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const fg = require("api-dylux");
const {
    exec
} = require("child_process");
const path = require("path");
const SimplDB = require("simpl.db");
const {
    inspect
} = require("util");

// Connection message
console.log("Connecting...");

// Create a new bot instance
const bot = new Client({
    prefix: global.bot.prefix,
    readIncommingMsg: true,
    printQRInTerminal: !global.system.usePairingCode,
    phoneNumber: global.bot.phoneNumber,
    usePairingCode: global.system.usePairingCode,
    selfReply: true
});

// Create a new database instance
const db = new SimplDB();
global.db = db;

// Event handling when the bot is ready
bot.ev.once(Events.ClientReady, (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Create command handlers and load commands
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Assign global handler
global.handler = handler;

// Event handling when a message appears
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const senderNumber = ctx._sender.jid.split("@")[0];
    const senderJid = ctx._sender.jid;
    const groupNumber = ctx.isGroup() ? m.key.remoteJid.split("@")[0] : null;
    const groupJid = ctx.isGroup() ? m.key.remoteJid : null;
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;

    // Ignore messages sent by the bot itself
    if (m.key.fromMe) return;

    // Auto-typing simulation for commands
    if (smpl.isCmd(m, ctx)) ctx.simulateTyping();

    // AFK handling: Mentioned users
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        mentionJids.forEach(async (mentionJid) => {
            const fetchAFKMention = db.fetch(`user.${mentionJid.split("@")[0]}.afk`);
            if (fetchAFKMention) {
                const reason = await db.fetch(`user.${senderNumber}.afk.reason`);
                const timeStamp = await db.fetch(`user.${senderNumber}.afk.timeStamp`);
                const timeAgo = smpl.convertMsToDuration(Date.now() - timeStamp);

                ctx.reply(`Dia AFK dengan alasan ${reason} selama ${timeAgo || "kurang dari satu detik."}.`);
            }
        });
    }

    // AFK handling: Returning from AFK
    const fetchAFKMessage = await db.fetch(`user.${senderNumber}.afk`);
    if (fetchAFKMessage) {
        const reason = await db.fetch(`user.${senderNumber}.afk.reason`);
        const timeStamp = await db.fetch(`user.${senderNumber}.afk.timeStamp`);
        const timeAgo = smpl.convertMsToDuration(Date.now() - timeStamp);
        await db.delete(`user.${senderNumber}.afk`);

        return ctx.reply(`Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo}.`);
    }

    // Owner-only commands
    if (smpl.isOwner(ctx, senderNumber) === 1) {
        // Eval command: Execute JavaScript code
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

        // Exec command: Execute shell commands
        if (m.content && m.content.startsWith && m.content.startsWith("$ ")) {
            const command = m.content.slice(2);

            try {
                const output = await new Promise((resolve, reject) => {
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

                return await ctx.reply(output);
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
            }
        }

        // Group-specific actions
        if (isGroup) {
            const fetchAntilink = await db.fetch(`group.${groupNumber}.antilink`);
            if (fetchAntilink) {
                const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
                if (m.content && urlRegex.test(m.content)) {
                    if ((await smpl.isAdmin(ctx)) === 1) return;

                    await ctx.deleteMessage(m.key);

                    return ctx.reply(`${bold("[ ! ]")} Jangan kirim tautan!`);
                }
            }
        }
    }

    // Private messages: Menfess handling
    if (isPrivate) {
        const fetchMessageDataMenfess = await db.fetch(`menfess.${senderNumber}`);
        if (fetchMessageDataMenfess) {
            const from = await db.fetch(`menfess.${senderNumber}.from`);
            try {
                await ctx.sendMessage(`${from}@s.whatsapp.net`, {
                    text: `❖ ${bold("Menfess")}\n` +
                        `Hai, saya ${global.bot.name}, Dia (${senderNumber}) menjawab pesan menfess yang Anda kirimkan.\n` +
                        "-----\n" +
                        `${m.content}\n` +
                        "-----\n" +
                        "Jika ingin membalas, Anda harus mengirimkan perintah lagi.\n",
                });
                await db.delete(`menfess.${senderNumber}`);

                return ctx.reply("Pesan berhasil terkirim!");
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
            }
        }
    }
});

// Event handling when a user joins a group
bot.ev.once(Events.UserJoin, async (m) => {
    const {
        id,
        participants
    } = m;

    try {
        const fetchWelcome = await db.fetch(`group.${id.split("@")[0]}.welcome`);
        if (fetchWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profile;
                try {
                    profile = await bot.core.profilePictureUrl(jid, "image");
                } catch {
                    profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu";
                }

                await bot.core.sendMessage(id, {
                    text: `Selamat datang @${jid.split("@")[0]} di grup ${metadata.subject}!`,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            title: "JOIN",
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: profile,
                            sourceUrl: global.bot.groupChat,
                        },
                    },
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return bot.core.sendMessage(id, {
            text: `${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`,
        });
    }
});

// Event handling when a user leaves a group
bot.ev.once(Events.UserLeave, async (m) => {
    const {
        id,
        participants
    } = m;

    try {
        const fetchWelcome = await db.fetch(`group.${id.split("@")[0]}.welcome`);
        if (fetchWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profile;
                try {
                    profile = await bot.core.profilePictureUrl(jid, "image");
                } catch {
                    profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu";
                }

                await bot.core.sendMessage(id, {
                    text: `@${jid.split("@")[0]} keluar dari grup ${metadata.subject}.`,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            title: "LEAVE",
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: profile,
                            sourceUrl: global.bot.groupChat,
                        },
                    },
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return bot.core.sendMessage(id, {
            text: `${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`,
        });
    }
});

// Launch the bot
bot.launch().catch((error) => console.error("Error:", error));