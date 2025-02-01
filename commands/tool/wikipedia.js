const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "wikipedia",
    aliases: ["wiki"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("toxicdevil", "/search/wikipedia", {
                lang: "id",
                query: input
            });
            const data = (await axios.get(apiUrl)).data.result;

            return await ctx.reply(
                `${quote(data.info)}\n` +
                `${quote(`Baca selengkapnya di: ${data.url}`)}\n` +
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