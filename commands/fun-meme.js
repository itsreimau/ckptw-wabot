const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const axios = require("axios");
const mime = require("mime-types");

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

        const apiUrl = createAPIUrl("https://candaan-api.vercel.app", "/api/image/random", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply({
                image: {
                    url: data.data.url
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Meme")}\n` +
                    "\n" +
                    `➲ Sumber: ${data.data.source}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};