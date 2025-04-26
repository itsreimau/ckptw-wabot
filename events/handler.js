// Impor modul dan dependensi yang diperlukan
const {
    Events,
    monospace,
    quote,
    VCardBuilder
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");
const {
    exec
} = require("node:child_process");
const fs = require("node:fs");
const util = require("node:util");

// Fungsi untuk menangani event pengguna bergabung/keluar grup
async function handleUserEvent(bot, m, type) {
    const {
        id,
        participants
    } = m;

    try {
        const groupId = tools.general.getID(id);
        const groupDb = await db.get(`group.${groupId}`) || {};

        if (groupDb?.mutebot) return;
        if (!groupDb?.option?.welcome) return;

        const metadata = await bot.core.groupMetadata(id);

        for (const jid of participants) {
            const profilePictureUrl = await bot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            const customText = type === "UserJoin" ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
            const userId = tools.general.getID(jid);
            const userName = await db.get(`user.${userId}.username`) || null;
            const userTag = `@${userId}`;

            const text = customText ?
                customText
                .replace(/%tag%/g, userTag)
                .replace(/%subject%/g, metadata.subject)
                .replace(/%description%/g, metadata.description) :
                (type === "UserJoin" ?
                    quote(`👋 Selamat datang ${userTag} di grup ${metadata.subject}!`) :
                    quote(`👋 ${userTag} keluar dari grup ${metadata.subject}.`));
            const canvas = tools.api.createUrl("fast", "/canvas/welcome", {
                avatar: profilePictureUrl,
                background: config.bot.thumbnail,
                title: type === "UserJoin" ? "WELCOME" : "GOODBYE",
                description: userName || userId
            });

            try {
                await bot.core.sendMessage(id, {
                    image: {
                        url: canvas
                    },
                    mimetype: mime.lookup("png"),
                    caption: text,
                    mentions: [jid]
                });
            } catch (error) {
                if (error.status !== 200) await bot.core.sendMessage(id, {
                    text,
                    mentions: [jid]
                });
            }

            if (type === "UserJoin" && groupDb?.text?.intro) await bot.core.sendMessage(id, {
                text: groupDb?.text?.intro,
                mentions: [jid]
            });
        }
    } catch (error) {
        const errorText = util.format(error);
        consolefy.error(`Error: ${errorText}`);
        if (config.system.reportErrorToOwner) await bot.core.sendMessage(`${config.owner.id}@s.whatsapp.net`, {
            text: `${quote("⚠️ Terjadi kesalahan:")}\n` +
                `${quote("─────")}\n` +
                monospace(errorText)
        });
        await bot.core.sendMessage(id, {
            text: quote(`⚠️ Terjadi kesalahan: ${error.message}`)
        });
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
            const timeago = tools.general.convertMsToDuration(Date.now() - botRestart.timestamp);
            await bot.core.sendMessage(botRestart.jid, {
                text: quote(`✅ Berhasil dimulai ulang! Membutuhkan waktu ${timeago}.`),
                edit: botRestart.key
            });
            await db.delete("bot.restart");
        }

        // Tetapkan config pada bot
        const id = tools.general.getID(m.user.id);
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
        const senderId = tools.general.getID(senderJid);
        const groupJid = isGroup ? ctx.id : null;
        const groupId = isGroup ? tools.general.getID(groupJid) : null;
        const isOwner = tools.general.isOwner(senderId);
        const isCmd = tools.general.isCmd(m.content, ctx.bot);

        // Mengambil basis data
        const botDb = await db.get("bot") || {};
        const userDb = await db.get(`user.${senderId}`) || {};
        const groupDb = await db.get(`group.${groupId}`) || {};

        const muteList = groupDb?.mute || [];

        // Pengecekan mode bot (group, private, self) dan sistem mute
        if ((botDb?.mode === "group" && !isGroup) || (botDb?.mode === "private" && isGroup) || (botDb?.mode === "self" && !isOwner)) return;
        if (groupDb?.mutebot && (!isOwner && !await ctx.group().isSenderAdmin())) return;
        if (muteList.includes(senderId)) return await ctx.deleteMessage(m.key);

        isGroup ? consolefy.info(`Incoming message from group: ${groupId}, by: ${senderId}`) : consolefy.info(`Incoming message from: ${senderId}`); // Log pesan masuk

        // Grup atau Pribadi
        if (isGroup || isPrivate) {
            config.bot.dbSize = fs.existsSync("database.json") ? tools.general.formatSize(fs.statSync("database.json").size / 1024) : "N/A"; // Penangan pada ukuran basis data

            // Penanganan basis data pengguna
            if (isOwner || userDb?.premium) db.set(`user.${senderId}.coin`, 0);
            if (userDb?.coin !== 0 && (userDb?.coin === undefined || !Number.isFinite(userDb?.coin))) db.set(`user.${senderId}.coin`, 100);
            if (userDb?.coin > 10000) db.set(`user.${senderId}.coin`, 10000);
            if (userDb?.uid !== tools.general.generateUID(senderId, true)) db.set(`user.${senderId}.uid`, tools.general.generateUID(senderId, true));
            if (!userDb?.username) db.set(`user.${senderId}.username`, `@user_${tools.general.generateUID(senderId, false)}`);

            if (isCmd?.didyoumean) await ctx.reply(quote(`❎ Anda salah ketik, sepertinya ${monospace(isCmd?.prefix + isCmd?.didyoumean)}.`)); // Did you mean?

            // Perintah khusus Owner
            if (isOwner && m.content) {
                // Perintah Eval (Jalankan kode JavaScript)
                if (m.content.startsWith("==> ") || m.content.startsWith("=> ")) {
                    const code = m.content.slice(m.content.startsWith("==> ") ? 4 : 3);
                    try {
                        const result = await eval(m.content.startsWith("==> ") ? `(async () => { ${code} })()` : code);
                        await ctx.reply(monospace(util.inspect(result)));
                    } catch (error) {
                        const errorText = util.format(error);
                        consolefy.error(`Error: ${errorText}`);
                        await ctx.reply(
                            `${quote("⚠️ Terjadi kesalahan:")}\n` +
                            `${quote("─────")}\n` +
                            monospace(errorText)
                        );
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
                        await ctx.reply(
                            `${quote("⚠️ Terjadi kesalahan:")}\n` +
                            `${quote("─────")}\n` +
                            monospace(errorText)
                        );
                    }
                }
            }

            // Penanganan AFK (Pengguna yang disebutkan atau di-balas/quote)
            const userAFKJids = ctx.quoted.senderJid ? [tools.general.getID(ctx.quoted.senderJid)] : m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.map(jid => tools.general.getID(jid)) || [];
            if (userAFKJids.length > 0) {
                if (m.key.fromMe) return;

                for (const userAFKJid of userAFKJids) {
                    const userAFK = await db.get(`user.${userAFKJid}.afk`) || {};
                    if (userAFK?.reason && userAFK?.timestamp) {
                        const timeago = tools.general.convertMsToDuration(Date.now() - userAFK.timestamp);
                        await ctx.reply(quote(`📴 Dia sedang AFK ${userAFK.reason ? `dengan alasan "${userAFK.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                    }
                }
            }

            // Penanganan AFK (Menghapus status AFK pengguna yang mengirim pesan)
            const userAFK = userDb?.afk || {};
            if (userAFK?.reason && userAFK?.timestamp) {
                const timeElapsed = Date.now() - userAFK.timestamp;
                if (timeElapsed > 3000) {
                    const timeago = tools.general.convertMsToDuration(timeElapsed);
                    await db.delete(`user.${senderId}.afk`);
                    await ctx.reply(quote(`📴 Anda telah keluar dari AFK ${userAFK.reason ? `dengan alasan "${userAFK.reason}"` : "tanpa alasan"} selama ${timeago}.`));
                }
            }
        }

        // Penanganan obrolan grup
        if (isGroup) {
            if (m.key.fromMe) return;

            // Penanganan antilink 
            if (groupDb?.option?.antilink && await tools.general.isUrl(m.content) && !await ctx.group().isSenderAdmin()) {
                await ctx.deleteMessage(m.key);
                await ctx.reply(quote("⛔ Jangan kirim tautan!"));
                if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
            }

            // Penanganan antinsfw
            if (groupDb?.option?.antinsfw) {
                const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), "image");
                if (checkMedia && !await ctx.group().isSenderAdmin()) {
                    const buffer = await ctx.msg.media.toBuffer();
                    const uploadUrl = await tools.general.upload(buffer, "image");
                    const apiUrl = tools.api.createUrl("fast", "/tool/imagechecker", {
                        url: uploadUrl
                    });
                    const result = (await axios.get(apiUrl)).data.result.status.toLowerCase();

                    if (result === "nsfw") {
                        await ctx.deleteMessage(m.key);
                        await ctx.reply("⛔ Jangan kirim NSFW!");
                        if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
                    }
                }
            }

            // Penanganan antispam
            const now = Date.now();

            if (groupDb?.option?.antispam) {
                const key = `group.${groupId}.spam`;
                const spamData = await db.get(key) || {};

                const {
                    count = 0,
                        lastMessageTime = 0
                } = spamData[senderId] || {};

                const timeDiff = now - lastMessageTime;
                const newCount = timeDiff < 5000 ? count + 1 : 1;

                spamData[senderId] = {
                    count: newCount,
                    lastMessageTime: now
                };

                await db.set(key, spamData);

                if (newCount > 5) {
                    await ctx.deleteMessage(m.key);
                    await ctx.reply(quote("⛔ Jangan spam!"));
                    if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
                    delete spamData[senderId];
                    await db.set(key, spamData);
                }
            }

            // Penanganan antisticker
            if (groupDb?.option?.antisticker) {
                const checkMedia = await tools.cmd.checkMedia(ctx.getMessageType(), "sticker");
                if (checkMedia && !await ctx.group().isSenderAdmin()) {
                    await ctx.deleteMessage(m.key);
                    await ctx.reply("⛔ Jangan kirim stiker!");
                    if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
                }
            }

            // Penanganan antitoxic
            if (groupDb?.option?.antitoxic) {
                const toxicRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i;
                if (m.content && toxicRegex.test(m.content) && !await ctx.group().isSenderAdmin()) {
                    await ctx.deleteMessage(m.key);
                    await ctx.reply(quote("⛔ Jangan toxic!"));
                    if (!config.system.restrict && groupDb?.option?.autokick) await ctx.group().kick([ctx.sender.jid]);
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

                        if (m.content?.match(/\b(delete|stop)\b/i)) {
                            const replyText = quote("✅ Pesan menfess telah dihapus!");
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
                .setNumber(config.owner.id).build();
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
    bot.ev.on(Events.UserJoin, async (m) => handleUserEvent(bot, m, "UserJoin"));
    bot.ev.on(Events.UserLeave, async (m) => handleUserEvent(bot, m, "UserLeave"));
};