const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "jokes",
    category: "entertainment",
    handler: {
        banned: true,
        cooldown: true,
        coin: 10
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const apiUrl = tools.api.createUrl("https://candaan-api.vercel.app", "/api/text/random", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(data);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return message.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};