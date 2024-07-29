const {
    list
} = require("../tools/exports.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "enable",
    aliases: ["on", "enabled"],
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            admin: true,
            banned: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} welcome`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = await list.get("disable_enable");

            return ctx.reply(listText);
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx._msg.key.remoteJid.split("@")[0] : null;

            switch (input) {
                case "antilink":
                    await global.db.set(`group.${groupNumber}.antilink`, true);
                    return ctx.reply(`${bold("[ ! ]")} Fitur 'antilink' berhasil diaktifkan!`);
                case "welcome":
                    await global.db.set(`group.${groupNumber}.welcome`, true);
                    return ctx.reply(`${bold("[ ! ]")} Fitur 'welcome' berhasil diaktifkan!`);
                default:
                    return ctx.reply(`${bold("[ ! ]")} Perintah tidak valid. Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`);
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};