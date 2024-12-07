const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "meme",
    category: "entertainment",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const apiUrl = tools.api.createUrl("https://candaan-api.vercel.app", "/api/image/random", {});

        try {
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply({
                image: {
                    url: data.url
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Sumber: ${data.source}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};