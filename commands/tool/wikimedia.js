const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "wikimedia",
    category: "tool",
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
            const apiUrl = tools.api.createUrl("gifted", "/api/search/wikimedia", {
                title: input
            }, "apikey");
            const {
                data
            } = await axios.get(apiUrl);
            const result = tools.general.getRandomElement(data.results);

            return await ctx.reply({
                image: {
                    url: result.image
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
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