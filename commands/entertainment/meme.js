const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "meme",
    category: "entertainment",
    handler: {
        banned: true,
        cooldown: true,
        coin: 10
    },
    code: async (ctx) => {
        await global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const apiUrl = global.tools.api.createUrl("https://candaan-api.vercel.app", "/api/image/random", {});

        try {
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return ctx.reply({
                image: {
                    url: data.url
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Sumber: ${data.source}`)}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};