const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "lyrics",
    aliases: ["lirik", "lyric"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "hikaru utada - one last kiss"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/lirik", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Judul: ${data.title}`)}\n` +
                `${quote(`Album: ${data.album}`)}\n` +
                `${quote("─────")}\n` +
                `${result.lyrics}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};