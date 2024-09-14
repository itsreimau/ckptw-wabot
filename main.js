// Modul dan dependensi yang diperlukan.
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

// Pesan koneksi.
console.log("[ckptw-wabot] Menghubungkan...");

// Buat instance bot baru.
const bot = new Client({
    WAVersion: [2, 3000, 1015901307],
    autoMention: global.system.autoMention,
    phoneNumber: global.bot.phoneNumber,
    prefix: global.bot.prefix,
    readIncommingMsg: global.system.autoRead,
    printQRInTerminal: !global.system.usePairingCode,
    selfReply: global.system.selfReply,
    usePairingCode: global.system.usePairingCode
});

// Buat contoh database baru.
const db = new SimplDB();
global.db = db;

// Penanganan acara saat bot siap.
bot.ev.once(Events.ClientReady, async (m) => {
    console.log(`Siap di ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Buat penangan perintah dan muat perintah.
const cmd = new CommandHandler(bot, path.resolve(__dirname, "commands"));
cmd.load();

// Tetapkan global pada handler dan tools.
global.handler = handler;
global.tools = tools;

// Penanganan event ketika pesan muncul.
bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    const isGroup = ctx.isGroup();
    const isPrivate = !isGroup;
    const senderJid = ctx.sender.jid;
    const senderNumber = senderJid.replace(/@.*|:.*/g, "");
    const groupJid = isGroup ? m.key.remoteJid : null;
    const groupNumber = isGroup ? groupJid.split("@")[0] : null;

    // Log pesan masuk
    if (isGroup) {
        console.log(`[ckptw-wabot] Pesan masuk dari grup: ${groupNumber}, oleh: ${senderNumber}`);
    } else {
        console.log(`[ckptw-wabot] Pesan masuk dari: ${senderNumber}`);
    }

    // Basis data untuk pengguna.
    const userDb = await db.get(`user.${senderNumber}`);
    if (!userDb) {
        await db.set(`user.${senderNumber}`, {
            energy: 100,
            isBanned: false,
            isPremium: false,
            onCharger: false
        });
    }

    // Mengisi energi bagi pengguna yang menggunakan charger.
    await energyCharger();

    // Simulasi pengetikan otomatis untuk perintah.
    if (tools.general.isCmd(m, ctx)) ctx.simulateTyping();

    // "Did you mean?" untuk perintah salah ketik.
    const prefixRegex = new RegExp(ctx._config.prefix, "i");
    const content = m.content && m.content.trim();
    if (prefixRegex.test(content)) {
        const prefix = content.charAt(0);

        const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);
        const cmd = ctx._config.cmd;
        const listCmd = Array.from(cmd.values()).flatMap(command => {
            const aliases = Array.isArray(command.aliases) ? command.aliases : [];
            return [command.name, ...aliases];
        });

        const mean = didyoumean(cmdName, listCmd);

        if (mean && mean !== cmdName) ctx.reply(quote(`❓ Apakah maksud Anda ${monospace(prefix + mean)}?`));
    }

    // Penanganan AFK: Pengguna yang disebutkan.
    const mentionJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (mentionJids && mentionJids.length > 0) {
        for (const mentionJid of mentionJids) {
            const getAFKMention = db.get(`user.${mentionJid.split("@")[0]}.afk`);
            if (getAFKMention) {
                const [reason, timeStamp] = await Promise.all([
                    db.get(`user.${mentionJid.split("@")[0]}.afk.reason`),
                    db.get(`user.${mentionJid.split("@")[0]}.afk.timeStamp`)
                ]);
                const timeAgo = tools.general.convertMsToDuration(Date.now() - timeStamp);

                ctx.reply(quote(`🚫 Dia AFK dengan alasan ${reason} selama ${timeAgo || "kurang dari satu detik."}.`));
            }
        }
    }

    // Penanganan AFK : Berangkat dari AFK.
    const getAFKMessage = await db.get(`user.${senderNumber}.afk`);
    if (getAFKMessage) {
        const [reason, timeStamp] = await Promise.all([
            db.get(`user.${senderNumber}.afk.reason`),
            db.get(`user.${senderNumber}.afk.timeStamp`)
        ]);
        const timeAgo = tools.general.convertMsToDuration(Date.now() - timeStamp);
        await db.delete(`user.${senderNumber}.afk`);

        ctx.reply(quote(`📴 Anda mengakhiri AFK dengan alasan ${reason} selama ${timeAgo || "kurang dari satu detik."}.`));
    }

    // Perintah khusus pemilik.
    if (tools.general.isOwner(ctx, senderNumber, true)) {
        // Perintah eval: Jalankan kode JavaScript.
        if (m.content && m.content.startsWith && (m.content.startsWith("=>> ") || m.content.startsWith("=> "))) {
            const code = m.content.slice(2);

            try {
                const result = await eval(m.content.startsWith("=>> ") ? `(async () => { ${code} })()` : code);

                await ctx.reply(inspect(result));
            } catch (error) {
                console.error("[ckptw-wabot] Kesalahan:", error);
                ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
            }
        }

        // Perintah Exec: Jalankan perintah shell.
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
                console.error("[ckptw-wabot] Kesalahan:", error);
                ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
            }
        }
    }

    // Grup.
    if (isGroup) {
        // Penanganan antilink.
        const getAntilink = await db.get(`group.${groupNumber}.antilink`);
        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (getAntilink) {
            if (m.content && urlRegex.test(m.content)) {
                if (await tools.general.isAdmin(ctx, senderNumber)) return;

                await ctx.reply(quote(`⛔ Jangan kirim tautan!`));
                await ctx.deleteMessage(m.key);
            }
        }
    }

    // Pribadi.
    if (isPrivate) {
        // Penanganan menfess.
        const getMessageDataMenfess = await db.get(`menfess.${senderNumber}`);
        if (getMessageDataMenfess) {
            const [from, text] = await Promise.all([
                db.get(`menfess.${senderNumber}.from`),
                db.get(`menfess.${senderNumber}.text`)
            ]);

            if (ctx.quoted?.extendedTextMessage?.text === text) {
                try {
                    await sendMenfess(ctx, m, senderNumber, from);

                    ctx.reply(quote(`✅ Pesan berhasil terkirim!`));
                } catch (error) {
                    console.error("[ckptw-wabot] Kesalahan:", error);
                    ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
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


// Luncurkan bot.
bot.launch().catch((error) => console.error("[ckptw-wabot] Kesalahan:", error));

// Fungsi utilitas.
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
                text: `${senderNumber} telah merespons pesan menfess Anda.`,
                title: global.bot.name,
                thumbnailUrl: global.bot.thumbnail

            }
        }
    }

    await ctx.sendMessage(
        from + S_WHATSAPP_NET, {
            text: `${m.content}\n` +
                `${global.msg.readmore}\n` +
                "Jika ingin membalas, Anda harus mengirimkan perintah lagi.",
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
        const getWelcome = await db.get(`group.${id.split("@")[0]}.welcome`);
        if (getWelcome) {
            const metadata = await bot.core.groupMetadata(id);

            for (const jid of participants) {
                let profileUrl;
                try {
                    profileUrl = await bot.core.profilePictureUrl(jid, "image");
                } catch (error) {
                    profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
                }

                const message = m.eventsType === "UserJoin" ?
                    quote(`👋 Selamat datang @${jid.split("@")[0]} di grup ${metadata.subject}!`) :
                    quote(`👋 @${jid.split("@")[0]} keluar dari grup ${metadata.subject}.`);
                const card = tools.api.createUrl("aggelos_007", "/welcomecard", {
                    text1: jid.split("@")[0],
                    text2: m.eventsType === "UserJoin" ? "Selamat datang" : "Selamat tinggal!",
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
        console.error("[ckptw-wabot] Kesalahan:", error);
        bot.core.sendMessage(id, {
            text: quote(`⚠ Terjadi kesalahan: ${error.message}`)
        });
    }
}

async function energyCharger() {
    setInterval(async () => {
        const users = await db.get("user") || {};

        for (const senderNumber of Object.keys(users)) {
            const userPath = `user.${senderNumber}`;
            const user = await db.get(userPath) || {};

            if (user.onCharger) {
                let energy = await db.get(`${userPath}.energy`) || 0;
                const maxEnergy = 100;
                const energyIncrement = 5;

                if (energy < maxEnergy) {
                    energy = Math.min(energy + energyIncrement, maxEnergy);
                    await db.set(`${userPath}.energy`, energy);
                    console.log(`[ckptw-wabot] Energi ${senderNumber} sekarang: ${energy}`);
                } else {
                    await db.set(`${userPath}.onCharger`, false);
                    console.log(`[ckptw-wabot] Energi ${senderNumber} sudah penuh! Pengisian dihentikan.`);
                }
            }
        }
    }, 60000);
}