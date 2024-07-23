const {
    getList
} = require("../tools/list.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "disable",
    aliases: ["off", "disable"],
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            admin: true,
            banned: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.length ? ctx._args.join(" ") : null;

        if (!input) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} welcome`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = await getList("disable_enable");

            return ctx.reply(listText);
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx._msg.key.remoteJid.split("@")[0] : null;

            switch (input) {
                case "antilink":
                    await global.db.set(`group.${groupNumber}.antilink`, false);
                    return ctx.reply(`${bold("[ ! ]")} Fitur 'antilink' berhasil dinonaktifkan!`);
                case "welcome":
                    await global.db.set(`group.${groupNumber}.welcome`, false);
                    return ctx.reply(`${bold("[ ! ]")} Fitur 'welcome' berhasil dinonaktifkan!`);
                default:
                    return ctx.reply(`${bold("[ ! ]")} Perintah tidak valid. Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`);
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};