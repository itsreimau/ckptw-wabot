const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "meme",
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

        const apiUrl = global.tools.api.createUrl("https://candaan-api.vercel.app", "/api/image/random", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply({
                image: {
                    url: data.url
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`${await global.tools.msg.translate("Sumber", userLanguage)}: ${data.source}`)}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};