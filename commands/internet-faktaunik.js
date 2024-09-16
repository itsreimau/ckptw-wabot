const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: 10
        });
        if (status) return ctx.reply(message);

        try {
            const apiUrl = await global.tools.api.createUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random", {});
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(await global.tools.general.translate(data.text, "id"));
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};