const {
    bold,
    italic,
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");
const moment = require("moment-timezone");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help", "list", "listmenu"],
    category: "main",
    permissions: {},
    code: async (ctx) => {
        try {
            const {
                cmd
            } = ctx.bot;
            const tag = {
                "ai-chat": "AI (Chat)",
                "ai-image": "AI (Image)",
                "ai-misc": "AI (Miscellaneous)",
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

            let text = `Hai @${tools.cmd.getID(ctx.sender.jid)}, berikut adalah daftar perintah yang tersedia!\n` +
                "\n" +
                `${quote(`Tanggal: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${quote("Library: @itsreimau/ckptw-mod (Fork of @mengkodingan/ckptw)")}\n` +
                "\n" +
                `${italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
                `${config.msg.readmore}\n`;

            for (const category of Object.keys(tag)) {
                const categoryCmds = Array.from(cmd.values())
                    .filter(cmd => cmd.category === category)
                    .map(cmd => ({
                        name: cmd.name,
                        aliases: cmd.aliases,
                        permissions: cmd.permissions || {}
                    }));

                if (categoryCmds.length > 0) {
                    text += `◆ ${bold(tag[category])}\n`;

                    categoryCmds.forEach(cmd => {
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

            const contextInfo = {
                mentionedJid: [ctx.sender.jid],
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.bot.newsletterJid,
                    newsletterName: config.bot.name
                },
                externalAdReply: {
                    title: config.bot.name,
                    body: config.bot.note,
                    mediaType: 1,
                    thumbnail: await tools.cmd.fillImageWithBlur(config.bot.thumbnail),
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            };

            return await ctx.sendMessage(ctx.id, {
                text,
                contextInfo
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.note)
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};