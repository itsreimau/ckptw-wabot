// Import modul dan dependensi
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    Events
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const {
    exec
} = require("child_process");
const fs = require("fs");
const util = require("util");

// Utilitas
async function handleUserEvent(bot, m, type) {
    const {
        id,
        participants
    } = m;
    try {
        const groupId = tools.general.getID(id);
        const groupDb = await db.get(`group.${groupId}`) || {};

        if (groupDb?.option?.welcome) {
            const metadata = await bot.core.groupMetadata(id);
            const customText = groupDb?.text?.[type === "UserJoin" ? "welcome" : "goodbye"];
            const userTag = `@${tools.general.getID(participants[0])}`;

            const text = customText ?
                customText.replace(/%tag%/g, userTag).replace(/%subject%/g, metadata.subject).replace(/%description%/g, metadata.description) :
                quote(type === "UserJoin" ?
                    `👋 Selamat datang ${userTag} di grup ${metadata.subject}!` :
                    `👋 ${userTag} keluar dari grup ${metadata.subject}.`);

            await bot.core.sendMessage(id, {
                text,
                contextInfo: {
                    mentionedJid: [participants[0]],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        renderLargerThumbnail: true,
                        thumbnailUrl: await bot.core.profilePictureUrl(participants[0], "image").catch(() => config.bot.thumbnail),
                        sourceUrl: config.bot.website
                    }
                }
            });

            if (type === "UserJoin" && groupDb?.text?.intro) {
                await bot.core.sendMessage(id, {
                    text: groupDb.text.intro,
                    mentions: [participants[0]]
                });
            }
        }
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        await bot.core.sendMessage(id, {
            text: quote(`⚠️ Terjadi kesalahan: ${error.message}`)
        });
    }
}

// Events utama bot
module.exports = (bot) => {
    // Penanganan event saat bot siap
    bot.ev.once(Events.ClientReady, async (m) => {
        consolefy.success(`${config.bot.name} by ${config.owner.name}, ready at ${m.user.id}`);
        const botRestart = await db.get("bot.restart") || {};

        if (botRestart?.jid && botRestart.timestamp) {
            const timeago = tools.general.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: quote(`✅ Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`),
                edit: botRestart.key
            });
            db.delete("bot.restart");
        }

        // Tetapkan config pada bot
        const id = tools.general.getID(m.user.id);
        config.bot = {
            ...config.bot,
            id,
            jid: `${id}@s.whatsapp.net`,
            readyAt: bot.readyAt,
            groupLink: config.system.requireBotGroupMembership ? `https://chat.whatsapp.com/${await bot.core.groupInviteCode(config.bot.groupJid) || "FxEYZl2UyzAEI2yhaH34Ye"}` : undefined
        };
    });

    // Penanganan event ketika pesan muncul
    bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
        const isGroup = ctx.isGroup;
        const isPrivate = !isGroup;

        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const groupId = isGroup ? ctx.id : null;
        const groupId = isGroup ? tools.general.getID(ctx.id) : null;

        const isOwner = tools.general.isOwner(senderId);
        const isCmd = tools.general.isCmd(m.content, ctx.bot);

        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        if ((botDb.mode === "group" && !ctx.isGroup) || (botDb.mode === "private" && ctx.isGroup) || (botDb.mode === "self" && !isOwner)) return; // Penanganan mode bot

        if (groupDb.mute) return; // Penanganan mode mute pada grup

        ctx.isGroup ? consolefy.info(`Incoming message from group: ${groupId}, by: ${senderId}`) : consolefy.info(`Incoming message from: ${senderId}`); // Log pesan masuk

        // Penanganan perintah
        if (isCmd) {
            if (isCmd.didyoumean) await ctx.reply(quote(`❎ Anda salah ketik, sepertinya ${monospace(isCmd.prefix + isCmd.didyoumean)}.`)); // Did you mean?

            // Penanganan XP & Level untuk pengguna
            const xpGain = 10;
            const xpToLevelUp = 100;

            let newUserXp = (userDb?.xp || 0) + xpGain;
            if (newUserXp >= xpToLevelUp) {
                let newUserLevel = (userDb?.level || 0) + 1;
                newUserXp -= xpToLevelUp;

                const profilePictureUrl = await ctx.core.profilePictureUrl(ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

                if (userDb?.autolevelup) await ctx.reply({
                    text: `${quote(`Selamat! Kamu telah naik ke level ${newUserLevel}!`)}\n${config.msg.readmore}\n${quote(tools.msg.generateNotes([`Terganggu? Ketik ${monospace(`${isCmd.prefix}setprofile autolevelup`)} untuk menonaktifkan pesan autolevelup.`]))}`,
                    contextInfo: {
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: config.bot.website,
                            title: config.msg.watermark,
                            renderLargerThumbnail: true,
                            thumbnailUrl: profilePictureUrl || config.bot.thumbnail,
                            sourceUrl: config.bot.website
                        }
                    }
                });

                await db.set(`user.${senderId}.xp`, newUserXp);
                await db.set(`user.${senderId}.level`, newUserLevel);
            } else {
                await db.set(`user.${senderId}.xp`, newUserXp);
            }
        }

        // Perintah khusus Owner
        if (isOwner && m.content) {
            // Perintah Eval: Jalankan kode JavaScript
            if (m.content.startsWith("==> ") || m.content.startsWith("=> ")) {
                const code = m.content.slice(m.content.startsWith("==> ") ? 4 : 3);
                try {
                    const result = await eval(m.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);
                    await ctx.reply(monospace(util.inspect(result)));
                } catch (error) {
                    consolefy.error(`Error: ${error}`);
                    await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
                }
            }

            // Perintah Exec: Jalankan perintah shell
            if (m.content.startsWith("$ ")) {
                const command = m.content.slice(2);
                try {
                    const output = await util.promisify(exec)(command);
                    await ctx.reply(monospace(output.stdout || output.stderr));
                } catch (error) {
                    consolefy.error(`Error: ${error}`);
                    await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
                }
            }
        }

        // Penanganan AFK: Pengguna yang disebutkan
        const userJids = ctx.quoted.senderJid || m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (userJids?.length) {
            for (const mentionJid of userJids) {
                const userAFK = await db.get(`user.${mentionJid}.afk`) || {};
                if (userAFK?.reason && userAFK?.timestamp) {
                    const timeago = tools.general.convertMsToDuration(Date.now() - userAFK.timestamp);
                    await ctx.reply(quote(`📴 Dia sedang AFK ${userAFK.reason ? `dengan alasan "${userAFK.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                }
            }
        }

        // Menghapus status AFK pengguna
        const userAFK = await db.get(`user.${senderId}.afk`) || {};
        if (userAFK?.reason && userAFK?.timestamp) {
            const timeElapsed = Date.now() - userAFK.timestamp;
            if (timeElapsed > 3000) {
                const timeago = tools.general.convertMsToDuration(timeElapsed);
                await ctx.reply(quote(`📴 Anda telah keluar dari AFK ${userAFK.reason ? `dengan alasan "${userAFK.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                await db.delete(`user.${senderId}.afk`);
            }
        }

        // Penanganan grup
        if (ctx.isGroup && !m.key.fromMe) {
            if (groupDb?.option?.antilink && await tools.general.isUrl(m.content) && !await ctx.group().isctx.senderAdmin()) {
                await ctx.reply(quote(`⛔ Jangan kirim tautan!`));
                await ctx.deleteMessage(key);
                if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
            }

            // Penanganan antinsfw
            if (groupDb?.option?.antinsfw) {
                const checkMedia = await tools.general.checkMedia(ctx.getMessageType(), "image");
                if (checkMedia && !await ctx.group().isctx.senderAdmin()) {
                    const buffer = await ctx.msg.media.toBuffer();
                    const uploadUrl = await tools.general.upload(buffer);
                    const apiUrl = tools.api.createUrl("fasturl", "/tool/imagechecker", {
                        url: uploadUrl
                    });
                    const {
                        data
                    } = await axios.get(apiUrl);

                    if (data.results.status === "NSFW") {
                        await ctx.reply(`⛔ Jangan kirim NSFW!`);
                        await ctx.deleteMessage(key);
                        if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
                    }
                }
            }

            // Penanganan antisticker
            if (groupDb?.option?.antisticker) {
                const checkMedia = await tools.general.checkMedia(ctx.getMessageType(), "sticker");
                if (checkMedia && !await ctx.group().isctx.senderAdmin()) {
                    await ctx.reply(`⛔ Jangan kirim stiker!`);
                    await ctx.deleteMessage(key);
                    if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
                }
            }

            // Penanganan antitoxic
            if (groupDb?.option?.antitoxic) {
                const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                if (m.content && toxicRegex.test(m.content) && !await ctx.group().isctx.senderAdmin()) {
                    await ctx.reply(quote(`⛔ Jangan toxic!`));
                    await ctx.deleteMessage(key);
                    if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
                }
            }
        }

        // Penanganan menfess di pesan pribadi
        if (isPrivate && !m.key.fromMe) {
            const allMenfessDb = await db.get("menfess") || {};
            if (!isCmd || isCmd.didyoumean) {
                const menfessEntries = Object.entries(allMenfessDb);
                for (const [conversationId, menfessData] of menfessEntries) {
                    const {
                        from,
                        to
                    } = menfessData;
                    if (senderId === from || senderId === to) {
                        if (m.content.match(/\b(delete|stop)\b/i)) {
                            await ctx.reply(quote("✅ Pesan menfess telah dihapus!"));
                            await ctx.sendMessage(`${senderId === from ? to : from}@s.whatsapp.net`, {
                                text: quote("✅ Pesan menfess telah dihapus!")
                            });
                            await db.delete(`menfess.${conversationId}`);
                        } else {
                            await ctx.core.sendMessage(senderId === from ? `${to}@s.whatsapp.net` : `${from}@s.whatsapp.net`, {
                                forward: m
                            });
                        }
                    }
                }
            }
        }
    });

    // Penanganan peristiwa pengguna bergabung atau keluar dari grup
    bot.ev.on(Events.UserJoin, async (m) => handleUserEvent(bot, m, "UserJoin"));
    bot.ev.on(Events.UserLeave, async (m) => handleUserEvent(bot, m, "UserLeave"));
};