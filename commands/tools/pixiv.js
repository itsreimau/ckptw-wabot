const {
    ButtonBuilder,
    CarouselBuilder,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "pixiv",
    aliases: ["pix"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("ryzendesu", "/api/search/pixiv", {
                query: flag.input
            });
            const {
                Media
            } = (await axios.get(apiUrl)).data;

            const result = global.tools.general.getRandomElement(Media);
            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};