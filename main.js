// Modul dan dependensi yang diperlukan
const {
    ButtonBuilder,
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
    jidDecode,
    jidEncode,
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");
const {
    exec
} = require("child_process");
const path = require("path");
const {
    inspect
} = require("util");

// Pesan koneksi
console.log(`[${global.config.pkg.name}] Connecting...`);

// Buat instance bot baru
const bot = new Client({
    WAVersion: [2, 3000, 1015901307],
    phoneNumber: global.config.bot.phoneNumber,
    prefix: global.config.bot.prefix,
    readIncommingMsg: global.config.system.autoRead,
    printQRInTerminal: !global.config.system.usePairingCode,
    selfReply: global.config.system.selfReply,
    usePairingCode: global.config.system.usePairingCode
});

// Penanganan acara saat bot siap
bot.ev.once(Events.ClientReady, async (m) => {
    console.log(`[${global.config.pkg.name}] Ready at ${m.user.id}`);

    // Tetapkan global.config pada bot
    const jidDecode = await jidDecode(jid);
    await Promise.all([
        global.config.bot.jid = jidDecode.user + jidDecode.server,
        global.config.bot.number = jidDecode.user,
        global.config.bot.readyAt = bot.readyAt
    ]);
});

// Buat penangan perintah dan muat perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Penanganan event ketika pesan muncul
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;
    const senderJidDecode = await jidDecode(ctx.sender.jid);
    const senderJid = senderJidDecode.user + senderJidDecode.server;
    const senderNumber = senderJidDecode.user;
    const groupJidDecode = await jidDecode(ctx.id);
    const groupJid = isGroup ? jidEncode(groupJidDecode.user, groupJidDecode.server);
    const groupNumber = isGroup ? groupJidDecode.user;

    // Log pesan masuk
    if (isGroup) {
        console.log(`[${global.config.pkg.name}] Incoming message from group: ${groupNumber}, by: ${senderNumber}`);
    } else {
        console.log(`[${global.config.pkg.name}] Incoming message from: ${senderNumber}`);
    }

    // Basis data untuk pengguna
    const userDb = await global.db.get(`user.${senderNumber}`);
    if (!userDb) {
        await global.db.set(`user.${senderNumber}`, {
            coin: 100,
            level: 1,
            xp: 0
        });
    }


    // Penanganan untuk perintah
    const isCmd = global.tools.general.isCmd(m, ctx);
    if (isCmd) {
        await global.db.set(`user.${senderNumber}.lastUse`, Date.now());
        if (global.config.system.autoTypingOnCmd) ctx.simulateTyping(); // Simulasi pengetikan otomatis untuk perintah

        const mean = isCmd.didyoumean;
        if (mean) {
            const prefix = isCmd.prefix;
            const input = isCmd.input;

            if (global.config.system.useInteractiveMessage) {
                let button = new ButtonBuilder()
                    .setId(prefix + mean + input)
                    .setDisplayText("✅ Ya!")
                    .setType("quick_reply").build();

                ctx.replyInteractiveMessage({
                    body: quote(`❓ Apakah maksud Anda ${monospace(prefix + mean)}?`),
                    footer: global.config.msg.watermark,
                    nativeFlowMessage: {
                        buttons: [button]
                    }
                })
            } else if (!global.config.system.useInteractiveMessage) {
                ctx.reply(quote(`❓ Apakah maksud Anda ${monospace(prefix + mean)}?`));
            }
        }

        // Penanganan XP & Level untuk pengguna
        const xpGain = 5;
        let xpToLevelUp = 100;

        const [userXp, userLevel] = await Promise.all([
            global.db.get(`user.${senderNumber}.xp`) || 0,
            global.db.get(`user.${senderNumber}.level`) || 1
        ]);

        let newUserXp = userXp + xpGain;

        if (newUserXp >= xpToLevelUp) {
            let newUserLevel = userLevel + 1;
            newUserXp -= xpToLevelUp;

            xpToLevelUp = Math.floor(xpToLevelUp * 1.2);

            let profilePictureUrl;
            try {
                profilePictureUrl = await bot.core.profilePictureUrl(senderJid, "image");
            } catch (error) {
                profilePictureUrl = global.config.bot.picture.profile;
            }

            const card = global.tools.api.createUrl("aggelos_007", "/levelup", {
                avatar: profilePictureUrl,
                level: newUserLevel
            });

            ctx.reply({
                text: quote(`Selamat! Kamu telah naik ke level ${newUserLevel}!`),
                contextInfo: {
                    mentionedJid: [senderJid],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: global.config.bot.groupChat,
                        title: "LEVEL UP",
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: card || profilePictureUrl || global.config.bot.picture.thumbnail,
                        sourceUrl: global.config.bot.groupChat
                    }
                }
            });

            await Promise.all([
                global.db.set(`user.${senderNumber}.xp`, newUserXp),
                global.db.set(`user.${senderNumber}.level`, newUserLevel)
            ]);
        } else {
            await global.db.set(`user.${senderNumber}.xp`, newUserXp);
        }
    }

    // Perintah khusus Owner
    if (global.tools.general.isOwner(ctx, senderNumber, true)) {
        // Perintah eval: Jalankan kode JavaScript
        if (m.content && m.content.startsWith && (m.content.startsWith("==> ") || m.content.startsWith("=> "))) {
            const code = m.content.startsWith("==> ") ? m.content.slice(4) : m.content.slice(3);

            try {
                const result = await eval(m.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);

                ctx.reply(inspect(result));
            } catch (error) {
                console.error(`[${global.config.pkg.name}] Error:`, error);
                ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
            }
        }

        // Perintah Exec: Jalankan perintah shell
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

                ctx.reply(output);
            } catch (error) {
                console.error(`[${global.config.pkg.name}] Error:`, error);
                ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
            }
        }
    }

    // Penanganan AFK: Pengguna yang disebutkan
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        for (const mentionJid of mentionJids) {
            const getAFKMention = global.db.get(`user.${mentionJid.split("@")[0]}.afk`);
            if (getAFKMention) {
                const [reason, timeStamp] = await Promise.all([
                    global.db.get(`user.${mentionJid.split("@")[0]}.afk.reason`),
                    global.db.get(`user.${mentionJid.split("@")[0]}.afk.timeStamp`)
                ]);
                const timeAgo = global.tools.general.convertMsToDuration(Date.now() - timeStamp);

                ctx.reply(quote(`📴 Dia AFK dengan alasan ${reason} selama ${timeAgo}.`));
            }
        }
    }

    // Penanganan AFK : Berangkat dari AFK
    const getAFKMessage = await global.db.get(`user.${senderNumber}.afk`);
    if (getAFKMessage) {
        const [reason, timeStamp] = await Promise.all([
            global.db.get(`user.${senderNumber}.afk.reason`),
            global.db.get(`user.${senderNumber}.afk.timeStamp`)
        ]);

        const currentTime = Date.now();
        const timeElapsed = currentTime - timeStamp;

        if (timeElapsed > 3000) {
            const timeAgo = global.tools.general.convertMsToDuration(timeElapsed);
            await global.db.delete(`user.${senderNumber}.afk`);

            ctx.reply(quote(`📴 Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo}.`));
        }
    }

    // Grup
    if (isGroup) {
        if (m.key.fromMe) return;

        // Penanganan antilink
        const getAntilink = await global.db.get(`group.${groupNumber}.antilink`);
        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (getAntilink) {
            if (m.content && urlRegex.test(m.content) && !(await global.tools.general.isAdmin(ctx, senderNumber))) {
                ctx.reply(quote(`❎ Jangan kirim tautan!`));
                await ctx.deleteMessage(m.key);
                if (!global.config.system.restrict) await ctx.group().kick([senderJid]);
            }
        }
    }

    // Pribadi
    if (isPrivate) {
        // Penanganan menfess
        const getMessageDataMenfess = await global.db.get(`menfess.${senderNumber}`);
        if (getMessageDataMenfess) {
            const [from, text] = await Promise.all([
                global.db.get(`menfess.${senderNumber}.from`),
                global.db.get(`menfess.${senderNumber}.text`)
            ]);

            if (ctx.quoted?.extendedTextMessage?.text === text) {
                try {
                    await sendMenfess(ctx, m, senderNumber, from);

                    ctx.reply(quote(`✅ Pesan berhasil terkirim!`));
                    await global.db.delete(`menfess.${senderNumber}.from`);
                } catch (error) {
                    console.error(`[${global.config.pkg.name}] Error:`, error);
                    ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
                }
            }
        }
    }
});

// Penanganan peristiwa ketika pengguna bergabung atau keluar dari grup
bot.ev.on(Events.UserJoin, (m) => {
    m.eventsType = "UserJoin";
    handleUserEvent(m);
});

bot.ev.on(Events.UserLeave, (m) => {
    m.eventsType = "UserLeave";
    handleUserEvent(m);
});

// Luncurkan bot
bot.launch().catch((error) => console.error(`[${global.config.pkg.name}] Error:`, error));

// Fungsi utilitas
async function sendMenfess(ctx, m, senderNumber, from) {
    const fakeText = {
        key: {
            fromMe: false,
            participant: from + S_WHATSAPP_NET,
            ...({
                remoteJid: "status@broadcast"
            })
        },
        message: {
            extendedTextMessage: {
                text: `${senderNumber} telah merespons pesan menfess Anda.`,
                title: global.config.bot.name,
                thumbnailUrl: global.config.bot.picture.thumbnail

            }
        }
    }

    await ctx.sendMessage(from + S_WHATSAPP_NET, {
        text: `${m.content}\n` +
            `${global.config.msg.readmore}\n` +
            "Jika ingin membalas, Anda harus mengirimkan perintah lagi.",
        contextInfo: {
            mentionedJid: [jidEncode(senderNumber, S_WHATSAPP_NET)],
            externalAdReply: {
                mediaType: 1,
                previewType: 0,
                mediaUrl: global.config.bot.groupChat,
                title: global.config.msg.watermark,
                body: null,
                renderLargerThumbnail: true,
                thumbnailUrl: global.config.bot.picture.thumbnail,
                sourceUrl: global.config.bot.groupChat
            },
            forwardingScore: 9999,
            isForwarded: true
        },
        mentions: [jidEncode(senderNumber, S_WHATSAPP_NET)]
    }, {
        quoted: fakeText
    });
}

async function handleUserEvent(m) {
    const {
        id,
        participants
    } = m;

    try {
        const idDecode = await jidDecode(id);
        const getWelcome = await global.db.get(`group.${idDecode.user}.welcome`);
        if (getWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profilePictureUrl;
                try {
                    profilePictureUrl = await bot.core.profilePictureUrl(jid, "image");
                } catch (error) {
                    profilePictureUrl = global.config.bot.picture.profile;
                }

                const message = m.eventsType === "UserJoin" ?
                    quote(`👋 Selamat datang @${jid.split("@")[0]} di grup ${metadata.subject}!`) :
                    quote(`👋 @${jid.split("@")[0]} keluar dari grup ${metadata.subject}.`);
                const card = global.tools.api.createUrl("aggelos_007", "/welcomecard", {
                    text1: jid.split("@")[0],
                    text2: m.eventsType === "UserJoin" ? "Selamat datang!" : "Selamat tinggal!",
                    text3: metadata.subject,
                    avatar: profilePictureUrl,
                    background: global.config.bot.picture.thumbnail
                });

                await bot.core.sendMessage(id, {
                    text: message,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: global.config.bot.groupChat,
                            title: m.eventsType === "UserJoin" ? "JOIN" : "LEAVE",
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: card || profilePictureUrl || global.config.bot.picture.thumbnail,
                            sourceUrl: global.config.bot.groupChat
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        await bot.core.sendMessage(id, {
            text: quote(`❎ Terjadi kesalahan: ${error.message}`)
        });
    }
}