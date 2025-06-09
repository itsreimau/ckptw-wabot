// Impor modul dan dependensi yang diperlukan
const {
    Events,
    monospace,
    quote,
    VCardBuilder
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");
const {
    exec
} = require("node:child_process");
const fs = require("node:fs");
const util = require("node:util");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleWelcome(bot, m, type) {
    const groupJid = m.id;
    const groupId = tools.cmd.getID(m.id);
    const groupDb = await db.get(`group.${groupId}`) || {};

    if (groupDb?.mutebot) return;
    if (!groupDb?.option?.welcome) return;

    const metadata = await bot.core.groupMetadata(groupJid);

    for (const jid of m.participants) {
        const userTag = `@${tools.cmd.getID(jid)}`;
        const customText = type === "UserJoin" ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
        const text = customText ?
            customText
            .replace(/%tag%/g, userTag)
            .replace(/%subject%/g, metadata.subject)
            .replace(/%description%/g, metadata.description) :
            (type === "UserJoin" ?
                quote(`👋 Selamat datang ${userTag} di grup ${metadata.subject}!`) :
                quote(`👋 Selamat tinggal, ${userTag}!`));

        const profilePictureUrl = await bot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
        const contextInfo = {
            mentionedJid: [jid],
            forwardingScore: 9999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.bot.newsletterJid,
                newsletterName: config.bot.name
            },
            externalAdReply: {
                title: config.bot.name,
                body: config.msg.note,
                mediaType: 1,
                thumbnailUrl: profilePictureUrl
            }
        };

        await bot.core.sendMessage(groupJid, {
            text,
            contextInfo
        }, {
            quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.note)
        });

        if (type === "UserJoin" && groupDb?.text?.intro) await bot.core.sendMessage(groupJid, {
            text: groupDb?.text?.intro,
            mentions: [jid]
        }, {
            quoted: tools.cmd.fakeMetaAiQuotedText("Jangan lupa untuk mengisi intro!")
        });
    }
};

// Fungsi untuk menambahkan warning
async function addWarning(ctx, groupDb, senderJid, groupId) {
    const senderId = tools.cmd.getID(senderJid);

    const warnings = groupDb?.warnings || {};
    const current = warnings[senderId] || 0;
    const newWarning = current + 1;
    warnings[senderId] = newWarning;

    await db.set(`group.${groupId}.warnings`, warnings);

    const maxwarnings = groupDb?.maxwarnings || 3;
    await ctx.reply({
        text: quote(`⚠️ Warning ${newWarning}/${maxwarnings} untuk @${senderId}`),
        mentions: [senderJid]
    });

    if (newWarning >= maxwarnings) {
        await ctx.reply(quote(`⛔ Anda telah menerima ${maxwarnings} warning dan akan dikeluarkan dari grup!`));
        if (!config.system.restrict) await ctx.group().kick([senderJid]);
        delete warnings[senderId];
        await db.set(`group.${groupId}.warnings`, warnings);
    }
}

// Events utama bot
module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners); // Tetapkan max listeners untuk events

    // Event saat bot siap
    bot.ev.once(Events.ClientReady, async (m) => {
        consolefy.success(`${config.bot.name} by ${config.owner.name}, ready at ${m.user.id}`);
        const botRestart = await db.get("bot.restart") || {};

        // Mulai ulang bot
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: quote(`✅ Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`),
                edit: botRestart.key
            });
            await db.delete("bot.restart");
        }

        // Tetapkan config pada bot
        const id = tools.cmd.getID(m.user.id);
        config.bot = {
            ...config.bot,
            id,
            jid: `${id}@s.whatsapp.net`,
            readyAt: bot.readyAt,
            groupLink: await bot.core.groupInviteCode(config.bot.groupJid).then(code => `https://chat.whatsapp.com/${code}`).catch(() => "https://chat.whatsapp.com/FxEYZl2UyzAEI2yhaH34Ye")
        };
    });

    // Event saat bot menerima pesan
    bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
        // Variabel umum
        const isGroup = ctx.isGroup();
        const isPrivate = !isGroup;
        const senderJid = ctx.sender.jid;
        const senderId = tools.cmd.getID(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? tools.cmd.getID(groupJid) : null;
        const isOwner = tools.cmd.isOwner(senderId, m.key.id);
        const isCmd = tools.cmd.isCmd(m.content, ctx.bot);

        // Mengambil basis data
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};
        const userAfk = userDb?.afk || {};
        const muteList = groupDb?.mute || [];

        // Pengecekan mode bot (group, private, self) dan sistem mute
        if ((botDb?.mode === "group" && isPrivate) || (botDb?.mode === "private" && isGroup) || (botDb?.mode === "self" && !isOwner)) return;
        if (groupDb?.mutebot && (!isOwner && !await ctx.group().isSenderAdmin())) return;
        if (muteList.includes(senderId)) return await ctx.deleteMessage(m.key);

        isGroup ? consolefy.info(`Incoming message from group: ${groupId}, by: ${senderId}`) : consolefy.info(`Incoming message from: ${senderId}`); // Log pesan masuk

        // Grup atau Pribadi
        if (isGroup || isPrivate) {
            config.bot.dbSize = fs.existsSync("database.json") ? tools.msg.formatSize(fs.statSync("database.json").size / 1024) : "N/A"; // Penangan pada ukuran basis data
            config.bot.uptime = tools.msg.convertMsToDuration(Date.now() - config.bot.readyAt); // Penangan pada uptime

            // Penanganan basis data pengguna
            if (isOwner || userDb?.premium) db.set(`user.${senderId}.coin`, 0);
            if (userDb?.coin === undefined || !Number.isFinite(userDb.coin)) db.set(`user.${senderId}.coin`, 100);
            if (!userDb?.username) db.set(`user.${senderId}.username`, `@user_${tools.cmd.generateUID(senderId, false)}`);

            if (isCmd?.didyoumean) await ctx.reply(quote(`❎ Anda salah ketik, sepertinya ${monospace(isCmd?.prefix + isCmd?.didyoumean)}.`)); // Did you mean?

            // Perintah khusus Owner
            if (m.content && isOwner) {
                // Perintah Eval (Jalankan kode JavaScript)
                if (m.content.startsWith("==> ") || m.content.startsWith("=> ")) {
                    const code = m.content.slice(m.content.startsWith("==> ") ? 4 : 3);
                    try {
                        const result = await eval(m.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);
                        await ctx.reply(monospace(util.inspect(result)));
                    } catch (error) {
                        const errorText = util.format(error);
                        consolefy.error(`Error: ${errorText}`);
                        await ctx.reply(monospace(errorText));
                    }
                }

                // Perintah Exec: (Jalankan perintah shell)
                if (m.content.startsWith("$ ")) {
                    const command = m.content.slice(2);
                    try {
                        const output = await util.promisify(exec)(command);
                        await ctx.reply(monospace(output.stdout || output.stderr));
                    } catch (error) {
                        const errorText = util.format(error);
                        consolefy.error(`Error: ${errorText}`);
                        await ctx.reply(monospace(errorText));
                    }
                }
            }

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            if (userAfk.reason || userAfk.timestamp) {
                const timeElapsed = Date.now() - userAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(quote(`📴 Anda telah keluar dari AFK ${userAfk.reason ? `dengan alasan "${userAfk.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                    await db.delete(`user.${senderId}.afk`);
                }
            }
        }

        // Penanganan obrolan grup
        if (isGroup) {
            if (m.key.fromMe) return;

            // Penanganan AFK (Pengguna yang disebutkan atau di-balas/quote)
            const userMentions = ctx.quoted.senderJid ? [tools.cmd.getID(ctx.quoted.senderJid)] : m.message?.[m.messageType]?.contextInfo?.mentionedJid?.map(jid => tools.cmd.getID(jid)) || [];
            if (userMentions.length > 0) {
                if (m.key.fromMe) return;

                for (const userMention of userMentions) {
                    const userMentionAfk = await db.get(`user.${userMention}.afk`) || {};
                    if (userMentionAfk.reason || userMentionAfk.timestamp) {
                        const timeago = tools.msg.convertMsToDuration(Date.now() - userMentionAfk.timestamp);
                        await ctx.reply(quote(`📴 Jangan tag! Dia sedang AFK ${userMentionAfk.reason ? `dengan alasan "${userMentionAfk.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                    }
                }
            }

            // Penanganan antimedia
            for (const type of ["audio", "document", "gif", "image", "sticker", "video"]) {
                if (groupDb?.option?.[`anti${type}`]) {
                    const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), type);
                    if (checkMedia && !await ctx.group().isSenderAdmin()) {
                        await ctx.reply(quote(`⛔ Jangan kirim ${type}!`));
                        await ctx.deleteMessage(m.key);
                        if (!config.system.restrict && groupDb?.option?.autokick) {
                            await ctx.group().kick([senderJid]);
                        } else {
                            await addWarning(ctx, groupDb, senderJid, groupId);
                        }
                    }
                }
            }

            // Penanganan antilink
            if (groupDb?.option?.antilink && await tools.cmd.isUrl(m.content) && !await ctx.group().isSenderAdmin()) {
                await ctx.reply(quote("⛔ Jangan kirim link!"));
                await ctx.deleteMessage(m.key);
                if (!config.system.restrict && groupDb?.option?.autokick) {
                    await ctx.group().kick([senderJid]);
                } else {
                    await addWarning(ctx, groupDb, senderJid, groupId);
                }
            }

            // Penanganan antinsfw
            if (groupDb?.option?.antinsfw) {
                const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), "image");
                if (checkMedia && !await ctx.group().isSenderAdmin()) {
                    const buffer = await ctx.msg.media.toBuffer();
                    const uploadUrl = await tools.cmd.upload(buffer, "image");
                    const apiUrl = tools.api.createUrl("nirkyy", "/api/v1/nsfw-detector", {
                        url: uploadUrl
                    });
                    const result = (await axios.get(apiUrl)).data.data.isUnsafe;

                    if (result) {
                        await ctx.reply(quote("⛔ Jangan kirim NSFW, dasar cabul!"));
                        await ctx.deleteMessage(m.key);
                        if (!config.system.restrict && groupDb?.option?.autokick) {
                            await ctx.group().kick([senderJid]);
                        } else {
                            await addWarning(ctx, groupDb, senderJid, groupId);
                        }
                    }
                }
            }

            // Penanganan antispam
            if (groupDb?.option?.antispam) {
                const now = Date.now();
                const spamData = await db.get(`group.${groupId}.spam`) || {};
                const data = spamData[senderId] || {
                    count: 0,
                    lastMessageTime: 0
                };

                const timeDiff = now - data.lastMessageTime;
                const newCount = timeDiff < 5000 ? data.count + 1 : 1;

                spamData[senderId] = {
                    count: newCount,
                    lastMessageTime: now
                };

                await db.set(`group.${groupId}.spam`, spamData);

                if (newCount > 5 && !await ctx.group().isSenderAdmin()) {
                    await ctx.reply(quote("⛔ Jangan spam, ngelag woy!"));
                    await ctx.deleteMessage(m.key);
                    if (!config.system.restrict && groupDb?.option?.autokick) {
                        await ctx.group().kick([senderJid]);
                    } else {
                        await addWarning(ctx, groupDb, senderJid, groupId);
                    }
                    delete spamData[senderId];
                    await db.set(`group.${groupId}.spam`, spamData);
                }
            }

            // Penanganan antitagsw (Aku tidak tau apakah ini work atau tidak)
            if (groupDb?.option?.antitagsw) {
                const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), "groupStatusMention") || m.message?.protocolMessage?.type === 25 || m.message?.protocolMessage?.type === "STATUS_MENTION_MESSAGE";
                if (checkMedia && !await ctx.group().isSenderAdmin()) {
                    await ctx.reply(quote(`⛔ Jangan tag grup di SW, gak ada yg peduli!`));
                    await ctx.deleteMessage(m.key);
                    if (!config.system.restrict && groupDb?.option?.autokick) {
                        await ctx.group().kick([senderJid]);
                    } else {
                        await addWarning(ctx, groupDb, senderJid, groupId);
                    }
                }
            }

            // Penanganan antitoxic
            if (groupDb?.option?.antitoxic) {
                const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                if (m.content && toxicRegex.test(m.content) && !await ctx.group().isSenderAdmin()) {
                    await ctx.reply(quote("⛔ Jangan toxic!"));
                    await ctx.deleteMessage(m.key);
                    if (!config.system.restrict && groupDb?.option?.autokick) {
                        await ctx.group().kick([senderJid]);
                    } else {
                        await addWarning(ctx, groupDb, senderJid, groupId);
                    }
                }
            }
        }

        // Penanganan obrolan pribadi
        if (isPrivate && !m.key.fromMe) {
            // Penanganan menfess
            const allMenfessDb = await db.get("menfess") || {};
            if (!isCmd || isCmd?.didyoumean) {
                for (const [conversationId, {
                        from,
                        to
                    }] of Object.entries(allMenfessDb)) {
                    if (senderId === from || senderId === to) {
                        const targetId = `${senderId === from ? to : from}@s.whatsapp.net`;

                        if (m.content?.match(/\b(d|s|delete|stop)\b/i)) {
                            const replyText = quote("✅ Sesi menfess telah dihapus!");
                            await ctx.reply(replyText);
                            await ctx.sendMessage(targetId, {
                                text: replyText
                            });
                            await db.delete(`menfess.${conversationId}`);
                        } else {
                            await ctx.core.sendMessage(targetId, {
                                forward: m
                            });
                        }
                    }
                }
            }
        }
    });

    // Event saat bot menerima panggilan
    bot.ev.on(Events.Call, async (calls) => {
        if (!config.system.antiCall) return;

        for (let call of calls) {
            if (call.status !== "offer") continue;

            await bot.core.rejectCall(call.id, call.from);
            let rejectionMessage = await bot.core.sendMessage(call.from, {
                text: `Saat ini, kami tidak dapat menerima panggilan ${call.isVideo ? "video" : "suara"}.\n` +
                    "Jika Anda memerlukan bantuan, silakan menghubungi Owner!"
            });

            const vcard = new VCardBuilder()
                .setFullName(config.owner.name)
                .setOrg(config.owner.organization)
                .setNumber(config.owner.id)
                .build();
            return await bot.core.sendMessage(call.from, {
                contacts: {
                    displayName: config.owner.name,
                    contacts: [{
                        vcard
                    }]
                }
            }, {
                quoted: rejectionMessage
            });
        }
    });

    // Event saat pengguna bergabung atau keluar dari grup
    bot.ev.on(Events.UserJoin, async (m) => handleWelcome(bot, m, "UserJoin"));
    bot.ev.on(Events.UserLeave, async (m) => handleWelcome(bot, m, "UserLeave"));
};
module.exports.handleWelcome = handleWelcome; // Penanganan event pengguna bergabung/keluar grup