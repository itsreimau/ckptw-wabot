const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "lyrics",
    aliases: ["lirik", "lyric"],
    category: "tools",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "hikaru utada - one last kiss"))
        );

        try {
            const apiUrl = await tools.api.createUrl("btch", "/lirik", {
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
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};