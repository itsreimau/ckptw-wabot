const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", `/ramadhankukuh/database/master/src/lainnya/ppcouple.json`, {});
            const {
                data
            } = await axios.get(apiUrl);
            const result = global.tools.general.getRandomElement(data);

            await Promise.all([
                ctx.reply({
                    image: {
                        url: result.male
                    },
                    mimetype: mime.contentType("png"),
                }),
                ctx.reply({
                    image: {
                        url: result.female
                    },
                    mimetype: mime.contentType("png")
                })
            ]);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};