const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "cekkhodam",
    aliases: ["checkkhodam", "khodam"],
    category: "fun",
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
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} john doe`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.caliph.my.id", `/khodam.json`, {});
            const {
                data
            } = await axios.get(apiUrl);
            const khodam = global.tools.general.getRandomElement(data);

            return ctx.reply(
                `${quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${input}`)}\n` +
                `${quote(`Khodam: ${khodam}`)}\n` +
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