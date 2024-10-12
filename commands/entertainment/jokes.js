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
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => status && ctx.reply(message));
        const apiUrl = global.tools.api.createUrl("https://candaan-api.vercel.app", "/api/text/random", {});

        try {
            const response = await axios.get(apiUrl);
            const {
                data
            } = await response.data;

            return ctx.reply(data);
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return message.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};