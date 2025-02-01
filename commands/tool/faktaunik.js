const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        try {
            const apiUrl = tools.api.createUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random");
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(await tools.general.translate(data.text, "id"));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};