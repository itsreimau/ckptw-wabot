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
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        try {
            const apiUrl = global.tools.api.createUrl("sandipbaruwal", "/dp", {});
            const {
                data
            } = await axios.get(apiUrl);

            await Promise.all([
                ctx.reply({
                    image: {
                        url: data.male
                    },
                    mimetype: mime.contentType("png"),
                }),
                ctx.reply({
                    image: {
                        url: data.female
                    },
                    mimetype: mime.contentType("png")
                })
            ]);
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};