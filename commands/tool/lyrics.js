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
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "hikaru utada - one last kiss"))
        );

        try {
            const apiUrl = tools.api.createUrl("agung", "/api/lirik", {
                q: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(
                `${quote(`Judul: ${data.result.title}`)}\n` +
                `${quote(`Artis: ${data.result.artist}`)}\n` +
                `${quote("─────")}\n` +
                `${data.result.lyrics}\n` +
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