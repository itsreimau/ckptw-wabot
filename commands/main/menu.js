const mime = require("mime-types");
const moment = require("moment-timezone");

module.exports = {
    name: "menu",
    aliases: ["allmenu", "help", "list", "listmenu"],
    category: "main",
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

            let text = `Halo @${ctx.getId(ctx.sender.jid)}, berikut adalah daftar perintah yang tersedia!\n` +
                "\n" +
                `${formatter.quote(`Tanggal: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${formatter.quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${formatter.quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                `${formatter.quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${formatter.quote("Library: @itsreimau/gktw (Fork of @mengkodingan/ckptw)")}\n` +
                "\n" +
                `${formatter.italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
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
                    text += `◆ ${formatter.bold(tag[category])}\n`;

                    categoryCmds.forEach(cmd => {
                        let permissionsText = "";
                        if (cmd.permissions.coin) permissionsText += "ⓒ";
                        if (cmd.permissions.group) permissionsText += "Ⓖ";
                        if (cmd.permissions.owner) permissionsText += "Ⓞ";
                        if (cmd.permissions.premium) permissionsText += "Ⓟ";
                        if (cmd.permissions.private) permissionsText += "ⓟ";

                        text += formatter.quote(formatter.monospace(`${ctx.used.prefix + cmd.name} ${permissionsText}`));
                        text += "\n";
                    });

                    text += "\n";
                }
            }

            text += config.msg.footer;

            return await ctx.sendMessage(ctx.id, {
                text,
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: config.bot.newsletterJid,
                        newsletterName: config.bot.name
                    },
                    externalAdReply: {
                        title: config.bot.name,
                        body: config.bot.version,
                        mediaType: 1,
                        thumbnailUrl: config.bot.thumbnail,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: tools.cmd.fakeMetaAiQuotedText(config.msg.note)
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};