const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "lyrics",
    aliases: ["lirik", "lyric"],
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
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "hikaru utada - one last kiss"))
        );

        try {
            const apiUrl = await global.tools.api.createUrl("widipe", "/lirik", {
                text: input
            });
            const {
                result
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Judul: ${result.title}`)}\n` +
                `${quote(`Artis: ${result.artist}`)}\n` +
                `${quote("─────")}\n` +
                `${result.lyrics}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};