// Impor modul dan dependensi yang diperlukan
const {
    Events,
    monospace,
    quote,
    VCardBuilder
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const fs = require("node:fs");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleWelcome(bot, m, type) {
    const groupJid = m.id;
    const groupId = bot.getId(m.id);
    const groupDb = await db.get(`group.${groupId}`) || {};

    if (groupDb?.mutebot) return;
    if (!groupDb?.option?.welcome) return;

    for (const jid of m.participants) {
        const isWelcome = type === Events.UserJoin;
        const userTag = `@${bot.getId(jid)}`;
        const customText = isWelcome ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
        const metadata = await bot.core.groupMetadata(groupJid);
        const text = customText ?
            customText
            .replace(/%tag%/g, userTag)
            .replace(/%subject%/g, metadata.subject)
            .replace(/%description%/g, metadata.description) :
            (isWelcome ?
                quote(`👋 Selamat datang ${userTag} di grup ${metadata.subject}!`) :
                quote(`👋 Selamat tinggal, ${userTag}!`));

        const profilePictureUrl = await bot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
        const contextInfo = {
            mentionedJid: [jid],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.bot.newsletterJid,
                newsletterName: config.bot.name
            },
            externalAdReply: {
                title: config.bot.name,
                body: config.bot.version,
                mediaType: 1,
                thumbnailUrl: profilePictureUrl
            }
        };

        await bot.core.sendMessage(groupJid, {
            text,
            contextInfo
        }, {
            quoted: tools.cmd.fakeMetaAiQuotedText(`Event: ${type}`)
        });

        if (isWelcome && groupDb?.text?.intro) await bot.core.sendMessage(groupJid, {
            text: groupDb?.text?.intro,
            mentions: [jid]
        }, {
            quoted: tools.cmd.fakeMetaAiQuotedText("Jangan lupa untuk mengisi intro!")
        });
    }
};

// Fungsi untuk menambahkan warning
async function addWarning(ctx, groupDb, senderJid, groupId) {
    const senderId = ctx.getId(senderJid);

    const warnings = groupDb?.warnings || {};
    const current = warnings[senderId] || 0;
    const newWarning = current + 1;
    warnings[senderId] = newWarning;

    await db.set(`group.${groupId}.warnings`, newWarning);

    const maxwarnings = groupDb?.maxwarnings || 3;
    await ctx.reply({
        text: quote(`⚠️ Warning ${newWarning}/${maxwarnings} untuk @${senderId}!`),
        mentions: [senderJid]
    });

    if (newWarning >= maxwarnings) {
        await ctx.reply(quote(`⛔ Kamu telah menerima ${maxwarnings} warning dan akan dikeluarkan dari grup!`));
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

        // Mulai ulang bot
        const botRestart = await db.get("bot.restart") || {};
        if (botRestart?.jid && botRestart?.timestamp) {
            const timeago = tools.msg.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: quote(`✅ Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`),
                edit: botRestart.key
            });
            await db.delete("bot.restart");
        }

        // Tetapkan config pada bot
        const id = bot.getId(m.user.id);
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
        const senderId = ctx.getId(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? ctx.getId(groupJid) : null;
        const isOwner = tools.cmd.isOwner(senderId, m.key.id);
        const isCmd = tools.cmd.isCmd(m.content, ctx.bot);

        // Mengambil database
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        // Pengecekan mode bot (group, private, self)
        if ((botDb?.mode === "group" && isPrivate) || (botDb?.mode === "private" && isGroup) || (botDb?.mode === "self" && !isOwner)) return;
        if (groupDb?.mutebot && (!isOwner && !await ctx.group().isSenderAdmin())) return;

        // Pengecekan mute pada grup
        const muteList = groupDb?.mute || [];
        if (muteList.includes(senderId)) return await ctx.deleteMessage(m.key);

        isGroup ? consolefy.info(`Incoming message from group: ${groupId}, by: ${senderId}`) : consolefy.info(`Incoming message from: ${senderId}`); // Log pesan masuk

        // Grup atau Pribadi
        if (isGroup || isPrivate) {
            config.bot.dbSize = fs.existsSync("database.json") ? tools.msg.formatSize(fs.statSync("database.json").size / 1024) : "N/A"; // Penangan pada ukuran database
            config.bot.uptime = tools.msg.convertMsToDuration(Date.now() - config.bot.readyAt); // Penangan pada uptime

            // Penanganan database pengguna
            if (isOwner || userDb?.premium) db.set(`user.${senderId}.coin`, 0);
            if (userDb?.coin === undefined || !Number.isFinite(userDb.coin)) db.set(`user.${senderId}.coin`, 100);
            if (!userDb?.uid || userDb?.uid !== tools.cmd.generateUID(senderId, true)) db.set(`user.${senderId}.uid`, tools.cmd.generateUID(senderId, false));
            if (!userDb?.username) db.set(`user.${senderId}.username`, `@user_${tools.cmd.generateUID(senderId, false)}`);

            if (isCmd?.didyoumean) await ctx.reply(quote(`❎ Kamu salah ketik, sepertinya ${monospace(isCmd.prefix + isCmd.didyoumean)}.`)); // Did you mean?

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            const userAfk = userDb?.afk || {};
            if (userAfk.reason || userAfk.timestamp) {
                const timeElapsed = Date.now() - userAfk.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.msg.convertMsToDuration(timeElapsed);
                    await ctx.reply(quote(`📴 Kamu telah keluar dari AFK ${userAfk.reason ? `dengan alasan "${userAfk.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                    await db.delete(`user.${senderId}.afk`);
                }
            }
        }

        // Penanganan obrolan grup
        if (isGroup) {
            if (m.key.fromMe) return;

            // Penanganan AFK (Pengguna yang disebutkan atau di-balas/quote)
            const userMentions = ctx.quoted.senderJid ? [ctx.getId(ctx.quoted.senderJid)] : m.message?.[m.messageType]?.contextInfo?.mentionedJid?.map(jid => ctx.getId(jid)) || [];
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
                if (groupDb?.option?.[`anti${type}`] && !await ctx.group().isSenderAdmin() && !isCmd) {
                    const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), type);
                    if (checkMedia) {
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
            if (groupDb?.option?.antilink && await tools.cmd.isUrl(m.content) && !await ctx.group().isSenderAdmin() && !isCmd) {
                await ctx.reply(quote("⛔ Jangan kirim link!"));
                await ctx.deleteMessage(m.key);
                if (!config.system.restrict && groupDb?.option?.autokick) {
                    await ctx.group().kick([senderJid]);
                } else {
                    await addWarning(ctx, groupDb, senderJid, groupId);
                }
            }

            // Penanganan antinsfw
            if (groupDb?.option?.antinsfw && !await ctx.group().isSenderAdmin() && !isCmd) {
                const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), "image");
                if (checkMedia) {
                    const buffer = await ctx.msg.media.toBuffer();
                    const uploadUrl = await tools.cmd.upload(buffer, "image");
                    const apiUrl = tools.api.createUrl("falcon", "/tools/nsfw-check", {
                        url: uploadUrl
                    });
                    const result = (await axios.get(apiUrl)).data.data.result.data;

                    if (result.nsfw || result.porn) {
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
            if (groupDb?.option?.antispam && !await ctx.group().isSenderAdmin() && !isCmd) {
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

                if (newCount > 5) {
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
            if (groupDb?.option?.antitagsw && !await ctx.group().isSenderAdmin() && !isCmd) {
                const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), "groupStatusMention") || m.message?.protocolMessage?.type === 25 || m.message?.protocolMessage?.type === "STATUS_MENTION_MESSAGE";
                if (checkMedia) {
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
            if (groupDb?.option?.antitoxic && !await ctx.group().isSenderAdmin() && !isCmd) {
                const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                if (m.content && toxicRegex.test(m.content)) {
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

        for (const call of calls) {
            if (call.status !== "offer") continue;

            await bot.core.rejectCall(call.id, call.from);
            const rejectionMsg = await bot.core.sendMessage(call.from, {
                text: `Saat ini, kami tidak dapat menerima panggilan ${call.isVideo ? "video" : "suara"}.\n` +
                    "Jika kamu memerlukan bantuan, silakan menghubungi Owner!"
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
                quoted: rejectionMsg
            });
        }
    });

    // Event saat pengguna bergabung atau keluar dari grup
    bot.ev.on(Events.UserJoin, async (m) => handleWelcome(bot, m, Events.UserJoin));
    bot.ev.on(Events.UserLeave, async (m) => handleWelcome(bot, m, Events.UserLeave));
};
module.exports.handleWelcome = handleWelcome; // Penanganan event pengguna bergabung/keluar grup