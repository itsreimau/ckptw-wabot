const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const fs = require("fs");
const path = require("path");

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

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} welcome`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = fs.readFileSync(path.resolve(__dirname, "../assets/txt/list-disable_enable.txt"), "utf8");

            return ctx.reply(
                `❖ ${bold("Daftar")}\n` +
                "\n" +
                `${listText}\n` +
                "\n" +
                global.msg.footer
            );
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx._msg.key.remoteJid.split("@")[0] : null;

            if (input === "antilink") {
                await global.db.set(`group.${groupNumber}.antilink`, false);
                return ctx.reply(`${bold("[ ! ]")} Berhasil dinonaktifkan!`);
            }

            if (input === "welcome") {
                await global.db.set(`group.${groupNumber}.welcome`, false);
                return ctx.reply(`${bold("[ ! ]")} Berhasil dinonaktifkan!`);
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};