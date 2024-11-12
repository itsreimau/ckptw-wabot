const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktoksearch",
    aliases: ["vts", "ttsearch", "vtsearch"],
    category: "search",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("aemt", "/tiktoksearch", {
                text: input
            });
            const {
                result
            } = (await axios.get(apiUrl)).data;
            const data = tools.general.getRandomElement(result.data);

            return await ctx.reply({
                video: {
                    url: data.play
                },
                mimetype: mime.lookup("mp4"),
                gifPlayback: false
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};