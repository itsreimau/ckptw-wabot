const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "aiimagesearch",
    aliases: ["aiimage", "aiimages", "aiimg", "aiimgs", "aiimgsearch"],
    category: "search",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("itzpire", "/ai/search-img", {
                q: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;
            const result = tools.general.getRandomElement(data);

            return await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Prompt: ${result.prompt}`)}\n` +
                    `${quote(`Sumber: ${result.source}`)}\n` +
                    `${quote(`Kreator: ${result.user.displayName}`)}\n` +
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