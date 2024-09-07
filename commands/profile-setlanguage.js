const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fs = require("fs/promises");
const path = require("path");

module.exports = {
    name: "setlanguage",
    aliases: ["setlang"],
    category: "profile",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(`${await global.tools.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`)
        );

        let lang;
        try {
            const list = await fs.readFile(path.join(__dirname, '../assets/lang.json'), 'utf8');
            lang = JSON.parse(list);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }

        if (input === "list") {
            const format = Object.entries(lang).map(([code, name]) => `- ${code}: ${name}`).join('\n');

            return ctx.reply(format);
        }

        if (!Object.keys(lang).includes(input)) return ctx.reply(quote(`⚠ ${await tools.msg.translate("Kode bahasa tidak valid. Gunakan 'daftar' untuk melihat bahasa yang tersedia.", userLanguage)}`));

        try {
            global.db.set(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`, input);

            return ctx.reply(quote(`✅ ${await global.tools.msg.translate("Bahasa berhasil diubah.", userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};