const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");
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

            let text = `Hai @${tools.general.getID(ctx.sender.jid)}, berikut adalah daftar perintah yang tersedia!\n` +
                "\n" +
                `${quote(`Tanggal: ${moment.tz(config.system.timeZone).locale("id").format("dddd, DD MMMM YYYY")}`)}\n` +
                `${quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH.mm.ss")}`)}\n` +
                "\n" +
                `${quote(`Bot Uptime: ${tools.general.convertMsToDuration(Date.now() - config.bot.readyAt)}`)}\n` +
                `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${quote("Library: @mengkodingan/ckptw")}\n` +
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

            const fakeQuotedText = {
                key: {
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
            const url = (await axios.get(tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/img2vid", {
                url: config.bot.thumbnail
            }))).data.result;

            return await ctx.sendMessage(ctx.id, {
                video: {
                    url
                },
                mimetype: mime.lookup("mp4"),
                caption: text,
                gifPlayback: true,
                contextInfo: {
                    mentionedJid: [ctx.sender.jid],
                    forwardingScore: 9999,
                    isForwarded: true
                },
            }, {
                quoted: fakeQuotedText
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};