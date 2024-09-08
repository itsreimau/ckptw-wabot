const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "simsimi",
    aliases: ["simi"],
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
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/simsimi", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            return ctx.reply(data);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};