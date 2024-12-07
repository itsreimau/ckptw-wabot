const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "tools",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const apiUrl = await tools.api.createUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random");
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(await tools.general.translate(data.text, "id"));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};