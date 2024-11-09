// Modul dan dependensi yang diperlukan
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
    exec
} = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");

// Pesan koneksi
console.log(`[${config.pkg.name}] Connecting...`);

// Buat instance bot baru
const bot = new Client({
    WAVersion: [2, 3000, 1015901307],
    phoneNumber: config.bot.phoneNumber,
    prefix: config.bot.prefix,
    readIncommingMsg: config.system.autoRead,
    printQRInTerminal: !config.system.usePairingCode,
    selfReply: config.system.selfReply,
    usePairingCode: config.system.usePairingCode
});

// Penanganan acara saat bot siap
bot.ev.once(Events.ClientReady, async (m) => {
    console.log(`[${config.pkg.name}] Ready at ${m.user.id}`);
    if (!(await db.get("bot.mode"))) await db.set("bot.mode", "public");

    // Tetapkan config pada bot
    const number = m.user.id.split(/[:@]/)[0];
    await Promise.all([
        config.bot.number = number,
        config.bot.id = `${number}@s.whatsapp.net`,
        config.bot.readyAt = bot.readyAt,
        config.bot.dbSize = fs.existsSync("database.json") ? (fs.statSync("database.json").size / 1024).toFixed(2) : "N/A"
    ]);
});

// Buat penangan perintah dan muat perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Penanganan event ketika pesan muncul
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.split(/[:@]/)[0];
    const groupJid = isGroup ? ctx.id : null;
    const groupNumber = isGroup ? groupJid.split("@")[0] : null;

    // Penanganan pada mode bot
    const botMode = await db.get("bot.mode");
    if (!tools.general.isOwner(ctx, senderNumber, true) && botMode === "self") return;

    // Log pesan masuk
    if (isGroup) {
        console.log(`[${config.pkg.name}] Incoming message from group: ${groupNumber}, by: ${senderNumber}`);
    } else {
        console.log(`[${config.pkg.name}] Incoming message from: ${senderNumber}`);
    }

    // Basis data untuk pengguna
    const [userDb, userPremium, lastClaimFreetrial] = await Promise.all([
        db.get(`user.${senderNumber}`),
        db.get(`user.${senderNumber}.isPremium`),
        db.get(`user.${senderNumber}.lastClaim.freetrial`)
    ]);

    if (!userDb) {
        await db.set(`user.${senderNumber}`, {
            coin: 1000,
            level: 0,
            xp: 0
        });
    }

    const currentTime = Date.now();
    const freetrialDuration = 7 * 24 * 60 * 60 * 1000;
    if (userPremium === "freetrial" && (currentTime - lastClaimFreetrial > freetrialDuration)) {
        await db.set(`user.${senderNumber}.isPremium`, false);
        await db.set(`user.${senderNumber}.lastClaim.freetrial`, "expired");

        await ctx.reply(quote(`❎ Masa percobaan Free Trial Anda sudah habis. Jika Anda ingin melanjutkan akses Premium, silakan hubungi Owner.`));
    }

    if (userPremium) await db.delete(`user.${senderNumber}.coin`);

    // Penanganan untuk perintah
    const isCmd = tools.general.isCmd(m, ctx);
    if (isCmd) {
        await db.set(`user.${senderNumber}.lastUse`, Date.now());
        if (config.system.autoTypingOnCmd) ctx.simulateTyping(); // Simulasi pengetikan otomatis untuk perintah

        // Did you mean?
        const mean = isCmd.didyoumean;
        const prefix = isCmd.prefix;
        const input = isCmd.input;

        if (mean) await ctx.reply(quote(`❓ Apakah maksud Anda ${monospace(prefix + mean)}?`));

        // Penanganan XP & Level untuk pengguna
        const xpGain = 10;
        let xpToLevelUp = 100;

        const [userXp, userLevel, autoLevelUp] = await Promise.all([
            db.get(`user.${senderNumber}.xp`) || 0,
            db.get(`user.${senderNumber}.level`) || 1,
            db.get(`user.${senderNumber}.autoLevelUp`) || true
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
                profilePictureUrl = config.bot.picture.profile;
            }

            const card = tools.api.createUrl("aggelos_007", "/levelup", {
                avatar: profilePictureUrl,
                level: newUserLevel
            });

            if (autoLevelUp) await ctx.reply({
                text: `${quote(`Selamat! Kamu telah naik ke level ${newUserLevel}!`)}\n` +
                    `${config.msg.readmore}\n` +
                    quote(tools.msg.generateNotes([`Terganggu? Ketik ${monospace(`${prefix}setprofile autolevelup`)} untuk menonaktifkan pesan autolevelup.`])),
                contextInfo: {
                    mentionedJid: [senderJid],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: "LEVEL UP",
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: card || profilePictureUrl || config.bot.picture.thumbnail,
                        sourceUrl: config.bot.website
                    }
                }
            });

            await Promise.all([
                db.set(`user.${senderNumber}.xp`, newUserXp),
                db.set(`user.${senderNumber}.level`, newUserLevel)
            ]);
        } else {
            await db.set(`user.${senderNumber}.xp`, newUserXp);
        }
    }

    // Perintah khusus Owner
    if (tools.general.isOwner(ctx, senderNumber, true)) {
        // Perintah eval: Jalankan kode JavaScript
        if (m.content && m.content.startsWith && (m.content.startsWith("==> ") || m.content.startsWith("=> "))) {
            const code = m.content.slice(m.content.startsWith("==> ") ? 4 : 3);

            try {
                const result = await eval(m.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);

                await ctx.reply(monospace(util.inspect(result)));
            } catch (error) {
                console.error(`[${config.pkg.name}] Error:`, error);
                await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
            }
        }

        // Perintah Exec: Jalankan perintah shell
        if (m.content && m.content.startsWith && m.content.startsWith("$ ")) {
            const command = m.content.slice(2);

            try {
                const output = await util.promisify(exec)(command);

                await ctx.reply(monospace(output.stdout || output.stderr));
            } catch (error) {
                console.error(`[${config.pkg.name}] Error:`, error);
                await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
            }
        }
    }

    // Penanganan AFK: Pengguna yang disebutkan
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        for (const mentionJid of mentionJids) {
            const getAFKMention = db.get(`user.${mentionJid.split(/[:@]/)[0]}.afk`);
            if (getAFKMention) {
                const [reason, timeStamp] = await Promise.all([
                    db.get(`user.${mentionJid.split(/[:@]/)[0]}.afk.reason`),
                    db.get(`user.${mentionJid.split(/[:@]/)[0]}.afk.timeStamp`)
                ]);
                const timeAgo = tools.general.convertMsToDuration(Date.now() - timeStamp);

                await ctx.reply(quote(`📴 Dia AFK dengan alasan ${reason} selama ${timeAgo}.`));
            }
        }
    }

    // Penanganan AFK : Berangkat dari AFK
    const getAFKMessage = await db.get(`user.${senderNumber}.afk`);
    if (getAFKMessage) {
        const [reason, timeStamp] = await Promise.all([
            db.get(`user.${senderNumber}.afk.reason`),
            db.get(`user.${senderNumber}.afk.timeStamp`)
        ]);

        const currentTime = Date.now();
        const timeElapsed = currentTime - timeStamp;

        if (timeElapsed > 3000) {
            const timeAgo = tools.general.convertMsToDuration(timeElapsed);
            await db.delete(`user.${senderNumber}.afk`);

            await ctx.reply(quote(`📴 Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo}.`));
        }
    }

    // Grup
    if (isGroup) {
        if (m.key.fromMe) return;

        // Penanganan antilink
        const getAntilink = await db.get(`group.${groupNumber}.antilink`);
        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (getAntilink) {
            if (m.content && urlRegex.test(m.content) && !(await tools.general.isAdmin(ctx, senderJid))) {
                await ctx.reply(quote(`❎ Jangan kirim tautan!`));
                await ctx.deleteMessage(m.key);
                await db.add(`group.${groupNumber}.warning.${senderNumber}`, 1);
            }
        }

        // Penanganan warning
        const getWarning = await db.get(`group.${groupNumber}.warning.${senderNumber}`);
        if (getWarning >= 3 && config.system.restrict) {
            await ctx.reply(quote(`❎ Kamu telah mencapai batas peringatan dan akan dikeluarkan dari grup!`));
            await ctx.group().kick([senderJid]);
            await db.set(`group.${groupNumber}.warning.${senderNumber}`, 0);
        }
    }

    // Pribadi
    if (isPrivate) {
        if (m.key.fromMe) return;

        // Penanganan anonymous_chat
        const anonymousChatPartnerData = await db.get(`anonymous_chat.conversation.${senderNumber}.partner`);

        if (anonymousChatPartnerData || !config.system.restrict) {
            const partnerId = `${anonymousChatPartnerData}@s.whatsapp.net`;

            if (!["stop", "search", "next", "contact"].includes(isCmd?.cmd)) {
                try {
                    await ctx.sendMessage(partnerId, {
                        forward: m
                    });
                } catch (error) {
                    console.error(`[${config.pkg.name}] Error:`, error);
                    await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
                }
            }
        }

        // Penanganan menfess
        const allMenfessData = await db.get("menfess");

        if (allMenfessData && typeof allMenfessData === "object" && Object.keys(allMenfessData).length > 0) {
            const menfessEntries = Object.entries(allMenfessData);

            for (const [conversationId, menfessData] of menfessEntries) {
                const {
                    from,
                    to
                } = menfessData;

                if (m.content && /delete|stop/i.test(m.content)) {
                    const senderInConversation = senderNumber === from || senderNumber === to;

                    if (senderInConversation) {
                        await db.delete(`menfess.${conversationId}`);

                        const targetNumber = senderNumber === from ? to : from;

                        await ctx.reply(quote("✅ Pesan menfess telah dihapus!"));
                        await ctx.sendMessage(`${targetNumber}@s.whatsapp.net`, {
                            text: quote("✅ Pesan menfess telah dihapus!")
                        });

                        continue;
                    }
                }

                try {
                    const senderInConversation = senderNumber === from || senderNumber === to;

                    if (senderInConversation) {
                        const targetId = (senderNumber === from) ? `${to}@s.whatsapp.net` : `${from}@s.whatsapp.net`;

                        await ctx._client.sendMessage(targetId, {
                            forward: m
                        });

                        await ctx.reply(quote(`✅ Pesan berhasil diteruskan!`));
                        await db.set(`menfess.${conversationId}.lastMsg`, Date.now());

                        break;
                    }
                } catch (error) {
                    console.error(`[${config.pkg.name}] Error:`, error);
                    await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
                }
            }
        }
    }
});

// Penanganan peristiwa ketika pengguna bergabung atau keluar dari grup
bot.ev.on(Events.UserJoin, async (m) => {
    m.eventsType = "UserJoin";
    handleUserEvent(m);
});

bot.ev.on(Events.UserLeave, async (m) => {
    m.eventsType = "UserLeave";
    handleUserEvent(m);
});

// Luncurkan bot
bot.launch().catch((error) => console.error(`[${config.pkg.name}] Error:`, error));

// Fungsi utilitas
async function handleUserEvent(m) {
    const {
        id,
        participants
    } = m;

    try {
        const getWelcome = await db.get(`group.${id.split(/[:@]/)[0]}.welcome`);
        if (getWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profilePictureUrl;
                try {
                    profilePictureUrl = await bot.core.profilePictureUrl(jid, "image");
                } catch (error) {
                    profilePictureUrl = config.bot.picture.profile;
                }

                const message = m.eventsType === "UserJoin" ?
                    quote(`👋 Selamat datang @${jid.split(/[:@]/)[0]} di grup ${metadata.subject}!`) :
                    quote(`👋 @${jid.split(/[:@]/)[0]} keluar dari grup ${metadata.subject}.`);
                const card = tools.api.createUrl("aggelos_007", "/welcomecard", {
                    text1: jid.split(/[:@]/)[0],
                    text2: m.eventsType === "UserJoin" ? "Selamat datang!" : "Selamat tinggal!",
                    text3: metadata.subject,
                    avatar: profilePictureUrl,
                    background: config.bot.picture.thumbnail
                });

                await bot.core.sendMessage(id, {
                    text: message,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: config.bot.website,
                            title: m.eventsType === "UserJoin" ? "JOIN" : "LEAVE",
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: card || profilePictureUrl || config.bot.picture.thumbnail,
                            sourceUrl: config.bot.website
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error(`[${config.pkg.name}] Error:`, error);
        await bot.core.sendMessage(id, {
            text: quote(`⚠️ Terjadi kesalahan: ${error.message}`)
        });
    }
}