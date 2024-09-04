const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const fetch = require("node-fetch");

module.exports = {
    name: "meme",
    category: "fun",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const apiUrl = global.tools.api.createUrl("https://candaan-api.vercel.app", "/api/image/random", {});

        try {
            const response = await fetch(apiUrl);
            const {
                data
            } = await response.json();

            return ctx.reply({
                image: {
                    url: data.url
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Sumber: ${data.source}`)}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};