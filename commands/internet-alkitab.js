const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "alkitab",
    aliases: ["injil"],
    category: "internet",
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

        const [abbr, chapter] = ctx.args;

        if (!ctx.args.length) return ctx.reply(
            `${quote(`⚠ ${await global.tools.msg.translate(`${await global.tools.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} kej 2:18`)}`)
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("alkitab");
            return ctx.reply(listText);
        }

        try {
            const apiUrl = await global.tools.api.createUrl("https://beeble.vercel.app", `/api/v1/passage/${abbr}/${chapter}`, {});
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const translations = await Promise.all([
                global.tools.msg.translate("Ayat", userLanguage)
            ]);
            const resultText = data.verses.map((d) => {
                return `${quote(`${translations[0]}: ${d.verse}`)}\n` +
                    `${quote(`${d.content}`)}`;
            }).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${quote(`${await global.tools.msg.translate("Nama", userLanguage)}: ${data.book.name}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Bab", userLanguage)}: ${data.book.chapter}`)}\n` +
                `${quote("─────")}\n` +
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};