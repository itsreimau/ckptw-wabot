const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "tools",
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

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", "/ramadhankukuh/database/master/src/lainnya/ppcouple.json", {});
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
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};