const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const moment = require("moment-timezone");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help", "list", "listmenu"],
    category: "general",
    permissions: {},
    code: async (ctx) => {
        try {
            const {
                cmd
            } = ctx.bot;
            const tag = {
                "ai-chat": "AI (Chat)",
                "ai-image": "AI (Image)",
                "converter": "Converter",
                "downloader": "Downloader",
                "entertainment": "Entertainment",
                "game": "Game",
                "group": "Group",
                "maker": "Maker",
                "profile": "Profile",
                "search": "Search",
                "tool": "Tool",
                "owner": "Owner",
                "information": "Information",
                "misc": "Miscellaneous"
            };

            let text = `Hai @${tools.general.getID(ctx.sender.jid)}, berikut adalah daftar perintah yang tersedia!\n` +
                "\n" +
                `${quote(`Tanggal: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${quote(`Uptime: ${tools.general.convertMsToDuration(Date.now() - config.bot.readyAt)}`)}\n` +
                `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${quote(`Library: @mengkodingan/ckptw`)}\n` +
                "\n" +
                `${italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
                `${config.msg.readmore}\n`;

            for (const category of Object.keys(tag)) {
                const categoryCommands = Array.from(cmd.values())
                    .filter(command => command.category === category)
                    .map(command => ({
                        name: command.name,
                        aliases: command.aliases,
                        permissions: command.permissions || {}
                    }));

                if (categoryCommands.length > 0) {
                    text += `◆ ${bold(tag[category])}\n`;

                    categoryCommands.forEach(cmd => {
                        let permissionsText = "";
                        if (cmd.permissions.coin) permissionsText += "ⓒ";
                        if (cmd.permissions.group) permissionsText += "Ⓖ";
                        if (cmd.permissions.owner) permissionsText += "Ⓞ";
                        if (cmd.permissions.premium) permissionsText += "Ⓟ";
                        if (cmd.permissions.private) permissionsText += "ⓟ";

                        text += quote(monospace(`${ctx.used.prefix + cmd.name} ${permissionsText}`));
                        text += "\n";
                    });

                    text += "\n";
                }
            }

            text += config.msg.footer;

            const fakeText = {
                key: {
                    fromMe: false,
                    participant: "13135550002@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    extendedTextMessage: {
                        text: config.msg.note,
                        title: config.bot.name
                    }
                }
            };

            return await ctx.sendMessage(ctx.id, {
                text,
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    externalAdReply: {
                        mediaType: 1,
                        previewType: 0,
                        mediaUrl: config.bot.website,
                        title: config.msg.watermark,
                        body: null,
                        renderLargerThumbnail: true,
                        thumbnailUrl: config.bot.thumbnail,
                        sourceUrl: config.bot.website
                    },
                    forwardingScore: 9999,
                    isForwarded: true
                },
                mentions: [ctx.sender.jid]
            }, {
                quoted: fakeText
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};