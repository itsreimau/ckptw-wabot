const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "entertainment",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const apiUrl = tools.api.createUrl("sandipbaruwal", "/dp");

        try {
            const {
                data
            } = await axios.get(apiUrl);

            return await Promise.all([
                ctx.reply({
                    image: {
                        url: data.male
                    },
                    mimetype: mime.lookup("png")
                }),
                ctx.reply({
                    image: {
                        url: data.female
                    },
                    mimetype: mime.lookup("png")
                })
            ]);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};